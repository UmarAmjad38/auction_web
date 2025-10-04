import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Typography, Tooltip, Avatar, ListItemIcon, Menu, MenuItem } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useHeaderStyles from './HeaderStyles';
import Cookies from 'js-cookie';
import CustomNavLink from '../../custom-components/CustomNavLink';
import EnhancedEncryptionRoundedIcon from '@mui/icons-material/EnhancedEncryptionRounded';
import {
    Logout as LogoutIcon,
} from '@mui/icons-material';
import ChangePasswordModal from './ChangePasswordModal';
import theme from '../../../theme';


const Header = () => {
    const location = useLocation();
    const classes = useHeaderStyles();
    const navigate = useNavigate();
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
    const clientName = (sessionStorage.getItem('authToken') ?
        JSON.parse(user).name : Cookies.get('user')
            ? JSON.parse(user).name : '')

    const navLinks = [
        { label: 'Home', path: '/home' },
        { label: 'Current Auctions', path: '/current-auctions' },
        { label: 'Listings', path: '/listings' },
        { label: 'My Bids', path: '/bids' },
        { label: 'Open Invoices', path: '/invoices' },
        { label: 'Live Stream', path: '/live' },
    ];

    const isSelected = (path: string) => {

        if (path === "/current-auctions" || path === "/live" || path === "/listings") {
            return location.pathname.replace(/\/+$/, '').includes(path);
        }
        return path === location.pathname;
    }

    const isAuthenticated = sessionStorage.getItem('authToken') || Cookies.get('user');

    const handleProfileClick = (event: any) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileMenuAnchor(null);
    };

    const handleChangePassword = () => {
        setChangePasswordOpen(true)
        handleProfileClose();
    }

    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{
                backgroundColor: 'white',
                boxShadow: 'none',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '10px 0',
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Logo Section */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/svgs/logo.svg`}
                        alt="Parker's Auction"
                        style={{ width: '12%', padding: '0 10px', cursor: 'pointer' }}
                        onClick={() => navigate('/home')}
                    />
                    {/* Navigation Links */}
                    <Box className={classes.navLinks}>
                        {navLinks.map((link) => (
                            <CustomNavLink
                                isSelected={isSelected(link.path)}
                                key={link.path}
                                to={link.path}
                            >
                                {link.label}
                            </CustomNavLink>
                        ))}
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {!isAuthenticated &&
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button variant="outlined" color="primary" sx={{ width: "120px", textTransform: 'none' }}
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Button>
                            <Button variant="contained" color="primary" sx={{ width: "120px", textTransform: 'none' }}
                                onClick={() => navigate('/signup')}
                            >
                                Sign up
                            </Button>
                        </Box>
                    }
                    {isAuthenticated &&
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Watchlist">
                                <IconButton sx={{ color: "black" }} onClick={() => navigate('/watchlist')}>
                                    <FavoriteBorderIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cart">
                                <IconButton sx={{ color: "black" }} onClick={() => navigate('/cart')}>
                                    <ShoppingCartIcon />
                                </IconButton>
                            </Tooltip>

                            <IconButton onClick={handleProfileClick}>
                                <Avatar alt={clientName ? clientName.toUpperCase() : ''} src="/static/images/avatar/1.jpg"
                                    sx={{
                                        height: '30px',
                                        width: '30px',
                                        fontSize: 16,
                                        border: `2px solid ${theme.palette.primary.main7}`,
                                        backgroundColor: theme.palette.primary.main
                                    }} />
                            </IconButton>
                            <Menu
                                anchorEl={profileMenuAnchor}
                                open={Boolean(profileMenuAnchor)}
                                onClose={handleProfileClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <MenuItem onClick={handleChangePassword} >
                                    <ListItemIcon>
                                        <EnhancedEncryptionRoundedIcon />
                                    </ListItemIcon>
                                    <Typography variant='body1'>Change Password</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => navigate('/logout')}>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <Typography variant='body1'>Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    }
                </Box>
            </Toolbar>
            <ChangePasswordModal changePasswordOpen={changePasswordOpen} setChangePasswordOpen={setChangePasswordOpen} />
        </AppBar>
    );
};

export default Header;
