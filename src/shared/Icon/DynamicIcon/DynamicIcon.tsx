import type {FC} from "react";
import {iconMap, type IconName} from "@/shared/Icon/DynamicIcon/IconMap.ts";
import type {SvgIconProps} from "@mui/material";

interface DynamicIconProps extends SvgIconProps {
    iconName?: string;
}

export const DynamicIcon: FC<DynamicIconProps> = ({ iconName, ...props }) => {
    try {
        const IconComponent = iconMap[iconName as IconName];

        if (!IconComponent) {
            const DefaultIcon = iconMap.Help;
            return <DefaultIcon {...props} />;
        }

        return <IconComponent {...props} />;
    } catch (error) {
        console.error(`Error rendering icon "${iconName}":`, error);
        const DefaultIcon = iconMap.Help;
        return <DefaultIcon {...props} />;
    }
}