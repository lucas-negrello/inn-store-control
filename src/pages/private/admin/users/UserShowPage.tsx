import {useParams} from "react-router-dom";
import {Box, Typography} from "@mui/material";

export default function UserShowPage() {
    const { id } = useParams();

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" color="textSecondary">Detalhes do Usuário</Typography>
            <Typography variant="body1">ID: {id}</Typography>
        </Box>
    )
}