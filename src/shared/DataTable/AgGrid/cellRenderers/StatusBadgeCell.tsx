import {createRenderer} from "@/shared/DataTable/AgGrid/CellRendererRegistry.tsx";
import {Chip} from "@mui/material";

export const StatusBadgeCell = createRenderer('statusBadge', ({value}) => {
    let color: 'success' | 'error' | 'secondary';

    switch (value) {
        case 'active':
        case 'Ativo':
        case true:
            color = 'success';
            break;
        case 'inactive':
        case 'Inativo':
        case false:
            color = 'error';
            break;
        default:
            color = 'secondary';
    }

    return (
        <Chip
            color={color}
            size="small"
            label={String(value ?? '')}
        />
    );
}, 10);
