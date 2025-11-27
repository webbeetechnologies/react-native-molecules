import clsx from 'clsx';

import styles from './styles.module.css';

type IconFamily = 'material' | 'material-rounded';

type ParsedIcon = {
    family: IconFamily;
    name: string;
};

const MATERIAL_FAMILIES: Record<string, IconFamily> = {
    material: 'material-rounded',
    'material-rounded': 'material-rounded',
};

function parseIcon(icon?: string): ParsedIcon | null {
    if (!icon) {
        return null;
    }
    const trimmed = icon.trim();
    if (!trimmed) {
        return null;
    }
    const value = trimmed.includes(':') ? trimmed.split(':', 2) : [];
    const family =
        value.length === 2
            ? MATERIAL_FAMILIES[value[0].trim().toLowerCase() as IconFamily]
            : MATERIAL_FAMILIES.material;
    const name = (value.length === 2 ? value[1] : trimmed).trim();

    if (!family || !name) {
        return null;
    }

    return {
        family,
        name,
    };
}

type SidebarIconProps = {
    icon?: string;
    className?: string;
};

export default function SidebarIcon({ icon, className }: SidebarIconProps) {
    const parsed = parseIcon(icon);

    if (!parsed) {
        return null;
    }

    const glyph = parsed.name;

    return (
        <span
            aria-hidden="true"
            className={clsx(styles.materialIcon, className)}
            data-family={parsed.family}>
            {glyph}
        </span>
    );
}
