

import React, { useState } from 'react';
import { 
    AppBar, Toolbar, IconButton, Typography, Drawer, 
     Box, CssBaseline 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header = () => {
  
    const [darkMode, setDarkMode] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    const toggleDrawer = (open) => () => {
        setMobileOpen(open);
    };

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    // const menuItems = [
    //    { text: 'Calender', href: 'calender' },
    

    // ];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" sx={{ backgroundColor: '#663300' }}>
                <Toolbar>
                    {isMobile ? (
                        <>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
                                {/* <List>
                                    {menuItems.map((item) => (
                                        <ListItem key={item.text} component={Link} to={item.href} onClick={toggleDrawer(false)}>
                                            <ListItemText primary={item.text} />
                                        </ListItem>
                                    ))}
                                </List> */}
                            </Drawer>
                        </>
                    ) : (
                        <>
                            {/* Home on Left */}
                            <Typography 
                                variant="h6" 
                                component={Link} 
                                to="/" 
                                sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                Calender
                            </Typography>

                            {/* Spacer to push menu items to the right */}
                            <Box sx={{ flexGrow: 1 }} />

                            {/* Menu Items on Right */}
                            {/* {menuItems.map((item) => (
                                <Typography 
                                    key={item.text}
                                    component={Link} 
                                    to={item.href} 
                                    sx={{ color: 'inherit', textDecoration: 'none', mx: 2, cursor: 'pointer' }}
                                >
                                    {item.text}
                                </Typography>
                            ))} */}
                        </>
                    )}

                    {/* Dark Mode Toggle on Far Right */}
                    <IconButton color="inherit" onClick={toggleDarkMode} sx={{ ml: 2 }}>
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Header;

