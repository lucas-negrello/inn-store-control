import type {ICustomIconButtonProps} from "@/shared/Button/IconButton/IconButtonType.ts";
import {IconButton} from "@mui/material";

export function CustomIconButton(props: ICustomIconButtonProps) {
    const {
        ariaLabel,
        icon,
        onClick,
        link,
        loading = false,
        disabled = false,
        size = 'medium',
        color = 'inherit',
        target = '_self',
    } = props;

    const Icon = icon;

    if (link) return (
        <IconButton
            aria-label={ariaLabel ?? 'Icon Button'}
            disabled={disabled}
            size={size}
            color={color}
            href={link}
            target={target}
            loading={loading}
            onClick={onClick}
        >
            <Icon />
        </IconButton>
    );
    return (
        <IconButton
            aria-label={ariaLabel ?? 'Icon Button'}
            disabled={disabled}
            size={size}
            color={color}
            loading={loading}
            onClick={onClick}
        >
            <Icon />
        </IconButton>
    );
}