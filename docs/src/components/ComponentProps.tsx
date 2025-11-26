import { componentDocsMetaMap } from '../data/component-docs';
import componentPropsDump from '../generated/component-props.json';
import type { ComponentPropDoc } from '../types/component-docs';
import { ComponentPropsTable } from './ComponentPropsTable';

const componentPropsIndex: Record<string, ComponentPropDoc> = Object.fromEntries(
    (componentPropsDump as ComponentPropDoc[]).map(entry => [entry.name, entry]),
);

type Props = {
    name: string;
};

export default function ComponentProps({ name }: Props) {
    const meta = componentDocsMetaMap[name];
    const propEntry = componentPropsIndex[name];

    return (
        <ComponentPropsTable
            rows={propEntry?.props ?? []}
            sourcePath={propEntry?.sourcePath}
            propsNote={meta?.propsNote}
            inherits={meta?.inherits}
        />
    );
}
