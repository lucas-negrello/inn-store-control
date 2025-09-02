import type {OverridableComponent} from "@mui/material/OverridableComponent";
import type {SvgIconTypeMap} from "@mui/material";

type TIconButtonIcon = OverridableComponent<SvgIconTypeMap> & {muiName: string};

export interface ICustomIconButtonProps {
    icon: TIconButtonIcon;
    onClick?: () => void;
    link?: string;
    disabled?: boolean;
    loading?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: "inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
    ariaLabel?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
}
