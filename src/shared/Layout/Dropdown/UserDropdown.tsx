import React, {type FC, useState} from "react";
import {useApp} from "@app/hooks/params/useApp.ts";
import {useNavigate} from "react-router-dom";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem, type SxProps,
    Typography
} from "@mui/material";
import {AccountCircle, Login, Logout, PersonAdd, Settings} from "@mui/icons-material";
import Grid from "@mui/material/Grid";

type UserDropdownProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
}

const slotProps = {
    paper: {
        elevation: 3,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            minWidth: 200
        }
    }
}

export const UserDropdownMenuButton: FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, isAuthenticated } = useApp();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                color="primary"
                onClick={handleClick}
                aria-controls={open ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                size="medium"
            >
                {isAuthenticated && user ? (
                    <Avatar sx={{ width: 32, height: 32 }}>
                        {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                ) : (
                    <AccountCircle />
                )}
            </IconButton>
            <UserDropdown
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            />
        </>
    )
}

export const UserDropdown: FC<UserDropdownProps> = ({ anchorEl, open, onClose }) => {
    const { user, isAuthenticated, logout } = useApp();
    const navigate = useNavigate();

    const handleMenuItemClick = (callback: () => void) => {
        callback();
        onClose();
    };

    const handleLoginClick = () => {
        navigate('/auth/login');
    }

    const handleRegisterClick = () => {
        navigate('/auth/register');
    }

    const handleAccountClick = () => {
        if (user?.id) {
            navigate(`/${user.id}/account`)
        }
    }

    const handleLogoutClick = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error on logout: ', error);
        }
    }

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            onClick={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={slotProps}
        >
            {isAuthenticated && user ? (
                <Grid>
                    <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                                {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" noWrap>
                                    {user.username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <MenuItem onClick={() => handleMenuItemClick(handleAccountClick)}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Minha Conta</ListItemText>
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={() => handleMenuItemClick(handleLogoutClick)}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Sair</ListItemText>
                    </MenuItem>
                </Grid>
            ) : (
                <Grid>
                    <MenuItem onClick={() => handleMenuItemClick(handleLoginClick)}>
                        <ListItemIcon>
                            <Login fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Entrar</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => handleMenuItemClick(handleRegisterClick)}>
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Criar Conta</ListItemText>
                    </MenuItem>
                </Grid>
            )}
        </Menu>
    )
}