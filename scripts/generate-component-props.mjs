import { Project } from 'ts-morph';
import { readdirSync, statSync } from 'fs';
import { join, relative, resolve, dirname } from 'path';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Get the directory of this script file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Root directory is one level up from scripts
const ROOT_DIR = resolve(__dirname, '..');
const MOLECULES_DIR = join(ROOT_DIR, 'packages/molecules');
const COMPONENTS_DIR = join(MOLECULES_DIR, 'components');
const OUTPUT_FILE = join(ROOT_DIR, 'docs/src/generated/component-props.json');

// Initialize TypeScript project
const project = new Project({
    tsConfigFilePath: join(MOLECULES_DIR, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
});

// Get all component directories
function getComponentDirectories(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    const components = [];

    for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('__')) {
            const componentPath = join(dir, entry.name);
            components.push({
                name: entry.name,
                path: componentPath,
            });
        }
    }

    return components;
}

// Find the main component file
function findComponentFile(componentDir) {
    const files = readdirSync(componentDir);

    // Try to find ComponentName.tsx first
    const componentName = componentDir.split('/').pop();
    const mainFile = files.find(f => f === `${componentName}.tsx`);

    if (mainFile) {
        return join(componentDir, mainFile);
    }

    // Fallback to index.tsx
    const indexFile = files.find(f => f === 'index.tsx');
    if (indexFile) {
        return join(componentDir, indexFile);
    }

    return null;
}

// Extract JSDoc description from a symbol
function getDescription(symbol) {
    try {
        const declarations = symbol.getDeclarations();
        if (declarations.length === 0) return '';

        const declaration = declarations[0];

        // Check if getJsDoc is available
        if (typeof declaration.getJsDoc === 'function') {
            const jsDocComments = declaration.getJsDoc();
            if (jsDocComments.length > 0) {
                const comment = jsDocComments[0].getComment();
                if (comment) {
                    // Handle both string and array of strings
                    if (typeof comment === 'string') {
                        return comment;
                    }
                    if (Array.isArray(comment)) {
                        return comment
                            .map(c => (typeof c === 'string' ? c : c.getText()))
                            .join(' ');
                    }
                }
            }
        }

        // Try to get description from JSDoc tags
        if (typeof declaration.getJsDocTags === 'function') {
            const jsDocTags = declaration.getJsDocTags();
            for (const tag of jsDocTags) {
                if (tag.getName() === 'description') {
                    const comment = tag.getComment();
                    if (comment) {
                        return typeof comment === 'string' ? comment : comment.getText();
                    }
                }
            }
        }
    } catch (error) {
        // Silently fail
    }

    return '';
}

// Extract JSDoc description from type node property signatures
function getDescriptionFromTypeNode(propsTypeNode, propName) {
    if (!propsTypeNode) return '';

    try {
        const findInNode = node => {
            if (!node) return '';

            const kindName = node.getKindName();

            if (kindName === 'TypeLiteral') {
                const members = node.getMembers();
                for (const member of members) {
                    if (member.getKindName() === 'PropertySignature') {
                        const nameNode = member.getNameNode();
                        if (nameNode && nameNode.getText() === propName) {
                            // Try to get JSDoc from this property signature
                            if (typeof member.getJsDocs === 'function') {
                                const jsDocs = member.getJsDocs();
                                if (jsDocs.length > 0) {
                                    const comment = jsDocs[0].getComment();
                                    if (comment) {
                                        if (typeof comment === 'string') {
                                            return comment;
                                        }
                                        if (Array.isArray(comment)) {
                                            return comment
                                                .map(c => (typeof c === 'string' ? c : c.getText()))
                                                .join(' ');
                                        }
                                    }
                                }
                            }
                            // Alternative: try getLeadingCommentRanges
                            if (typeof member.getLeadingCommentRanges === 'function') {
                                const comments = member.getLeadingCommentRanges();
                                for (const commentRange of comments) {
                                    const text = commentRange.getText();
                                    // Parse JSDoc comment
                                    const match = text.match(
                                        /\/\*\*\s*\n?\s*\*?\s*(.+?)(?:\n|\*\/)/s,
                                    );
                                    if (match) {
                                        return match[1]
                                            .trim()
                                            .replace(/^\*\s*/gm, '')
                                            .trim();
                                    }
                                }
                            }
                        }
                    }
                }
            } else if (kindName === 'IntersectionType') {
                const typeNodes = node.getTypeNodes();
                for (const typeNode of typeNodes) {
                    const result = findInNode(typeNode);
                    if (result) return result;
                }
            } else if (kindName === 'UnionType') {
                const typeNodes = node.getTypeNodes();
                for (const typeNode of typeNodes) {
                    const result = findInNode(typeNode);
                    if (result) return result;
                }
            }

            return '';
        };

        return findInNode(propsTypeNode);
    } catch (error) {
        return '';
    }
}

// Extract default value from component implementation
function getDefaultValue(componentFile, propName) {
    try {
        const sourceFile = project.getSourceFile(componentFile);
        if (!sourceFile) return null;

        // Look for default parameter values in the component function
        const functions = sourceFile.getFunctions();
        const arrowFunctions = sourceFile.getArrowFunctions();
        const allFunctions = [...functions, ...arrowFunctions];

        for (const func of allFunctions) {
            const params = func.getParameters();
            for (const param of params) {
                // Check if this is a destructured parameter (object binding pattern)
                const bindingName = param.getNameNode();
                if (bindingName && bindingName.getKindName() === 'ObjectBindingPattern') {
                    const elements = bindingName.getElements();
                    for (const element of elements) {
                        const name = element.getName();
                        const propertyNameNode = element.getPropertyNameNode();

                        // Get the actual property name
                        // If there's a property name node, use it (for aliased props like `expandedItemIds: expandedItemIdsProp`)
                        // Otherwise, use the binding name
                        let actualName = name;
                        if (propertyNameNode) {
                            const propNameText = propertyNameNode.getText();
                            // Remove quotes if present
                            actualName = propNameText.replace(/['"]/g, '');
                        }

                        // Check if this element matches our prop name
                        if (actualName === propName || name === propName) {
                            const initializer = element.getInitializer();
                            if (initializer) {
                                return formatDefaultValue(initializer.getText());
                            }
                        }
                    }
                } else {
                    // Non-destructured parameter
                    const paramName = param.getName();
                    if (paramName === propName) {
                        const initializer = param.getInitializer();
                        if (initializer) {
                            return formatDefaultValue(initializer.getText());
                        }
                    }
                }
            }
        }
    } catch (error) {
        // Silently fail if we can't extract default value
    }

    return null;
}

// Format default value string
function formatDefaultValue(text) {
    if (!text) return null;

    // Remove whitespace
    text = text.trim();

    // Handle boolean
    if (text === 'false') return 'false';
    if (text === 'true') return 'true';

    // Handle null/undefined
    if (text === 'null' || text === 'undefined') return null;

    // Handle string literals
    if (
        (text.startsWith("'") && text.endsWith("'")) ||
        (text.startsWith('"') && text.endsWith('"'))
    ) {
        return text.slice(1, -1);
    }

    // Handle template literals (simplified)
    if (text.startsWith('`') && text.endsWith('`')) {
        return text.slice(1, -1);
    }

    // Handle numbers
    if (!isNaN(Number(text)) && text !== '') {
        return text;
    }

    // Handle object/array literals
    if (text === '{}' || text === '[]') {
        return text;
    }

    // Handle empty object/array patterns
    if (text === 'emptyObj' || text === 'emptyObject') {
        return '{}';
    }

    // Return as-is for other cases (like function calls, constants, etc.)
    return text;
}

// Get type as string
function getTypeString(type, sourceFile) {
    try {
        let text = type.getText(sourceFile);

        // Remove import() type references and keep only the type name
        // Pattern: import("path").TypeName -> TypeName
        text = text.replace(/import\(["'][^"']+["']\)\.([A-Za-z_$][A-Za-z0-9_$]*)/g, '$1');

        // Also handle nested imports like: import("path").TypeName | import("path2").TypeName2
        // This regex handles multiple import patterns in a union/intersection
        text = text.replace(/import\(["'][^"']+["']\)\./g, '');

        // Clean up any remaining absolute paths
        const absolutePathRegex = /\/Users\/[^/]+\/[^/]+/g;
        text = text.replace(absolutePathRegex, match => {
            try {
                if (match.includes(ROOT_DIR)) {
                    return match.replace(ROOT_DIR + '/', '');
                }
                return match;
            } catch {
                return match;
            }
        });

        return text;
    } catch (error) {
        return 'unknown';
    }
}

// Extract props from a component
function extractProps(componentName, componentFile) {
    const sourceFile = project.getSourceFile(componentFile);
    if (!sourceFile) {
        console.warn(`Could not find source file: ${componentFile}`);
        return [];
    }

    // Find the Props type export
    let propsType = null;
    let propsTypeNode = null;
    let propsSourceFile = sourceFile;

    // First, try to find it as a type alias in the main file
    const typeAliases = sourceFile.getTypeAliases();
    for (const typeAlias of typeAliases) {
        if (typeAlias.getName() === 'Props') {
            propsType = typeAlias.getType();
            propsTypeNode = typeAlias.getTypeNode();
            break;
        }
    }

    if (!propsType) {
        // Try to find it in exported types of main file
        const exports = sourceFile.getExportedDeclarations();
        for (const [name, declarations] of exports) {
            if (name === 'Props') {
                for (const decl of declarations) {
                    if (decl.getKindName() === 'TypeAlias') {
                        propsType = decl.getType();
                        propsTypeNode = decl.getTypeNode();
                        break;
                    }
                }
            }
        }
    }

    // If not found in main file, check utils.ts
    if (!propsType) {
        const componentDir = componentFile.substring(0, componentFile.lastIndexOf('/'));
        const utilsFile = join(componentDir, 'utils.ts');
        const utilsSourceFile = project.getSourceFile(utilsFile);

        if (utilsSourceFile) {
            const utilsTypeAliases = utilsSourceFile.getTypeAliases();
            for (const typeAlias of utilsTypeAliases) {
                if (typeAlias.getName() === 'Props') {
                    propsType = typeAlias.getType();
                    propsTypeNode = typeAlias.getTypeNode();
                    propsSourceFile = utilsSourceFile;
                    break;
                }
            }
        }
    }

    if (!propsType) {
        return [];
    }

    const props = [];

    // Get properties directly defined in the Props type (not inherited)
    const directlyDefinedProps = new Set();

    // Extract properties from the type node structure
    if (propsTypeNode) {
        // Handle intersection types: Omit<...> & { ... }
        if (propsTypeNode.getKindName() === 'IntersectionType') {
            const types = propsTypeNode.getTypeNodes();
            for (const typeNode of types) {
                if (typeNode.getKindName() === 'TypeLiteral') {
                    const members = typeNode.getMembers();
                    for (const member of members) {
                        if (member.getKindName() === 'PropertySignature') {
                            const nameNode = member.getNameNode();
                            if (nameNode) {
                                directlyDefinedProps.add(nameNode.getText());
                            }
                        }
                    }
                }
            }
        } else if (propsTypeNode.getKindName() === 'TypeLiteral') {
            // Direct type literal
            const members = propsTypeNode.getMembers();
            for (const member of members) {
                if (member.getKindName() === 'PropertySignature') {
                    const nameNode = member.getNameNode();
                    if (nameNode) {
                        directlyDefinedProps.add(nameNode.getText());
                    }
                }
            }
        }
    }

    // If we found directly defined props, only use those
    // Otherwise, use all properties (for types that don't extend others)
    const properties = propsType.getProperties();
    const propsToProcess =
        directlyDefinedProps.size > 0
            ? properties.filter(p => directlyDefinedProps.has(p.getName()))
            : properties;

    for (const prop of propsToProcess) {
        const propName = prop.getName();
        const propType = prop.getTypeAtLocation(sourceFile);

        // Check if property is optional
        let isOptional = false;
        try {
            // Check the property symbol flags (1 = Optional)
            const flags = prop.getFlags();
            isOptional = (flags & 1) !== 0;

            // Also check the type node directly if available
            if (propsTypeNode) {
                let foundInNode = false;
                const checkNode = node => {
                    if (node.getKindName() === 'TypeLiteral') {
                        const members = node.getMembers();
                        for (const member of members) {
                            if (member.getKindName() === 'PropertySignature') {
                                const nameNode = member.getNameNode();
                                if (nameNode && nameNode.getText() === propName) {
                                    const questionToken = member.getQuestionTokenNode();
                                    if (questionToken) {
                                        isOptional = true;
                                    }
                                    foundInNode = true;
                                    return true;
                                }
                            }
                        }
                    } else if (node.getKindName() === 'IntersectionType') {
                        const types = node.getTypeNodes();
                        for (const typeNode of types) {
                            if (checkNode(typeNode)) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                checkNode(propsTypeNode);
            }

            // Fallback: check if type includes undefined
            if (!isOptional) {
                const typeText = propType.getText(sourceFile);
                isOptional = typeText.includes('| undefined') || typeText.endsWith(' | undefined');
            }
        } catch (error) {
            // Fallback: check if type includes undefined
            try {
                const typeText = propType.getText(sourceFile);
                isOptional = typeText.includes('| undefined') || typeText.endsWith(' | undefined');
            } catch {
                isOptional = false;
            }
        }

        // Get description from JSDoc
        let description = getDescription(prop);

        // If no description from symbol, try to get from type node
        if (!description && propsTypeNode) {
            description = getDescriptionFromTypeNode(propsTypeNode, propName);
        }

        // Get default value
        let defaultValue = getDefaultValue(componentFile, propName);

        props.push({
            name: propName,
            type: getTypeString(propType, sourceFile),
            optional: isOptional,
            description: description || '',
            defaultValue: defaultValue,
        });
    }

    return props;
}

// Main function
function generateComponentProps() {
    console.log('Generating component props...');

    const components = getComponentDirectories(COMPONENTS_DIR);
    const componentData = [];

    for (const component of components) {
        const componentFile = findComponentFile(component.path);

        if (!componentFile) {
            console.warn(`No component file found for ${component.name}`);
            continue;
        }

        const props = extractProps(component.name, componentFile);

        // Format sourcePath as react-native-molecules/components/ComponentName
        const sourcePath = `react-native-molecules/components/${component.name}`;

        componentData.push({
            name: component.name,
            sourcePath: sourcePath,
            props: props,
        });

        console.log(`✓ ${component.name} (${props.length} props)`);
    }

    // Sort by component name
    componentData.sort((a, b) => a.name.localeCompare(b.name));

    // Write to file
    writeFileSync(OUTPUT_FILE, JSON.stringify(componentData, null, 2), 'utf-8');

    console.log(`\nGenerated ${componentData.length} components to ${OUTPUT_FILE}`);
}

// Run the script
generateComponentProps();
