import type {FC} from "react";
import {iconMap, type IconName} from "@/shared/Icon/DynamicIcon/IconMap.ts";

interface DynamicIconProps extends SvgIconProps {
    iconName: string;
}

export const DynamicIcon: FC<DynamicIconProps> = ({ iconName, ...props }) => {
    const IconComponent = iconMap[iconName as IconName];

    if (!IconComponent) {
        const DefaultIcon = iconMap.Help;
        return <DefaultIcon {...props} />;
    }

    return <IconComponent {...props} />;
}