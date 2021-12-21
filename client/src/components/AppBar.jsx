import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NavigationDrawer from './NavigationDrawer';

export default function ButtonAppBar(props) {
  const { onLogOut } = props;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar style={{ background: '#87F6C1' }}>
          <NavigationDrawer onLogOut={onLogOut} />
          <a style={{ flexGrow: 1 }}></a>
          <Typography style={{ color: '#FFFFFF' }} variant="h6">
            Hungrig?
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
