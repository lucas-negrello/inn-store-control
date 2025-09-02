import {
    Dashboard,
    Inventory,
    Settings,
    LocalGroceryStore,
    BarChart,
    Help,
    Person,
} from '@mui/icons-material';

export const iconMap = {
    Dashboard,
    Inventory,
    Settings,
    LocalGroceryStore,
    BarChart,
    Help,
    Person,
} as const;

export type IconName = keyof typeof iconMap;