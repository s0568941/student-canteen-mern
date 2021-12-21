import React from 'react';
import { Snackbar } from '@mui/material';

function Info(props) {
  document.getElementById('root').style.backgroundColor = 'white';
  return (
    <div style={{ textAlign: 'center', display: 'grid' }}>
      <div>
        Waiter
        <br />
        Version 1.0
      </div>
      <div style={{ marginTop: '10%' }}>
        Impressum
        <br />
        <br />
        Waiter
        <br />
        Treskowallee 8<br />
        10318 Berlin
        <br />
      </div>
      <div style={{ margin: '10%', marginRight: '20%', marginLeft: '20%' }}>
        Falls Du Fragen zu der App hast, kannst Du dich gerne jederzeit an uns
        wenden:
        <br />
        <br />
        info&#64;waiter.com
      </div>
      <div style={{ marginTop: '10%' }}>&#169; 2021 Waiter</div>
      {typeof props.openSnackbar !== 'boolean' ? (
        <Snackbar
          open={false}
          message="Keine Internetverbindung gefunden :("
          key={'state.Transition.name1'}
        />
      ) : (
        <Snackbar
          open={props.openSnackbar}
          message="Keine Internetverbindung gefunden :("
          key={'state.Transition.name1'}
        />
      )}
    </div>
  );
}

export default Info;
