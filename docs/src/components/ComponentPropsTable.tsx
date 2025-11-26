import './ComponentPropsTable.css';

import type { ComponentPropRow } from '../types/component-docs';

type Props = {
    rows: ComponentPropRow[];
    sourcePath?: string;
    propsNote?: string;
    inherits?: string[];
};

export function ComponentPropsTable({ rows, sourcePath, propsNote, inherits }: Props) {
    const hasRows = rows.length > 0;

    if (!hasRows && !propsNote && !inherits?.length) {
        return null;
    }

    return (
        <div className="component-props-table">
            {propsNote ? <p className="props-note">{propsNote}</p> : null}

            {inherits?.length ? (
                <p className="props-inherits">
                    <strong>Inherits:</strong> {inherits.join(', ')}
                </p>
            ) : null}

            {hasRows ? (
                <div className="props-table-container">
                    <table className="props-table">
                        <thead>
                            <tr>
                                <th>Prop</th>
                                <th>Type</th>
                                <th>Default</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <code className="prop-name">{row.name}</code>
                                        {!row.optional ? (
                                            <span className="prop-required-badge">Required</span>
                                        ) : null}
                                    </td>
                                    <td>
                                        <code className="prop-type">{row.type}</code>
                                    </td>
                                    <td>
                                        {row.defaultValue ? (
                                            <code className="prop-default">{row.defaultValue}</code>
                                        ) : (
                                            <span className="prop-default-placeholder">—</span>
                                        )}
                                    </td>
                                    <td className="prop-desc">{row.description || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}

            {sourcePath ? (
                <div className="prop-meta-info">
                    Defined in <code>{sourcePath}</code>
                </div>
            ) : null}
        </div>
    );
}
