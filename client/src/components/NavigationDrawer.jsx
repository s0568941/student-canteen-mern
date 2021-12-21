import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EcoIcon from '@mui/icons-material/FilterVintage';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

export default function TemporaryDrawer(props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = anchor => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button key="Home" button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button key="MyMensa" button component={Link} to="/mymensa">
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="MyMensa" />
        </ListItem>
        <ListItem
          button
          key="Lieblingsgerichte"
          button
          component={Link}
          to="/favourites"
        >
          <ListItemIcon>
            <FastfoodIcon />
          </ListItemIcon>
          <ListItemText primary="Lieblingsgerichte" />
        </ListItem>
        <ListItem
          button
          key="Lifestyle"
          button
          component={Link}
          to="/lifestyle"
        >
          <ListItemIcon>
            <EcoIcon />
          </ListItemIcon>
          <ListItemText primary="Lifestyle" />
        </ListItem>
        <ListItem button key="Info" button component={Link} to="/info">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="Info" />
        </ListItem>
        <ListItem button key="Abmelden" button onClick={() => props.onLogOut()}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Abmelden" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer('left', true)}
      >
        <MenuIcon color="#FFFFFF" />
      </IconButton>
      <Drawer
        anchor="left"
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        {list('left')}
      </Drawer>
    </div>
  );
}
