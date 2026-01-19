import './ComponentDoc.css';

import Admonition from '@theme/Admonition';

import { componentDocsMetaMap } from '../data/component-docs';
import type { ComponentDocMeta } from '../types/component-docs';

const statusColorMap: Record<NonNullable<ComponentDocMeta['status']>, string> = {
    stable: '#25c2a0',
    beta: '#ff9800',
    experimental: '#e91e63',
};

type Props = {
    name: string;
};

export default function ComponentDoc({ name }: Props) {
    const meta = componentDocsMetaMap[name];
    const statusColor = meta?.status ? statusColorMap[meta.status] : undefined;

    if (!meta) {
        return (
            <div>
                <h2>{name}</h2>
                <Admonition type="caution" title="Missing Metadata">
                    Missing metadata for <code>{name}</code>. Update{' '}
                    <code>docs-v2/src/data/component-docs.ts</code>.
                </Admonition>
            </div>
        );
    }

    return (
        <div className="component-doc">
            <div className="component-doc__meta-row">
                <span className="component-doc__badge component-doc__badge--category">
                    {meta.category}
                </span>
                {statusColor && (
                    <span
                        className="component-doc__badge component-doc__status-badge"
                        style={{ backgroundColor: statusColor }}>
                        {meta.status?.toUpperCase()}
                    </span>
                )}
            </div>
            <h2>{meta.title ?? meta.name}</h2>
            <p className="component-doc__description">{meta.description}</p>

            <div className="component-doc__grid">
                <div>
                    <h3>Usage</h3>
                    <p>{meta.usage}</p>
                </div>
                {meta.highlights?.length ? (
                    <div>
                        <h3>Highlights</h3>
                        <ul>
                            {meta.highlights.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
                {meta.whenToUse?.length ? (
                    <div>
                        <h3>When to use it</h3>
                        <ul>
                            {meta.whenToUse.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>

            {meta.related?.length ? (
                <div className="component-doc__related">
                    <h3>Related components</h3>
                    <div className="component-doc__related-list">
                        {meta.related.map(item => (
                            <span key={item} className="component-doc__related-chip">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            ) : null}

            {meta.subcomponents?.length ? (
                <div className="component-doc__subcomponents">
                    <h3>Compound Components</h3>
                    <table className="component-doc__subcomponents-table">
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meta.subcomponents.map(item => {
                                const componentName = typeof item === 'string' ? item : item.name;
                                const description =
                                    typeof item === 'string' ? '-' : item.description || '-';
                                return (
                                    <tr key={componentName}>
                                        <td>
                                            <code>{componentName}</code>
                                        </td>
                                        <td>{description}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </div>
    );
}
