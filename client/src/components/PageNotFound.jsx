import React from 'react';
import { Link } from 'react-router-dom';
import { Snackbar } from '@mui/material';

function PageNotFound(props) {
  document.getElementById('root').style.backgroundColor = 'white';
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div>
        <img
          src="broken-link.png"
          style={{ width: 100, height: 100, margin: 10 }}
          id="icon"
          alt="Broken Link"
        />
        <div style={{ textAlign: 'block', margin: 10 }}>
          <h1>Diese Seite ist nicht verfügbar</h1>
          Der Link ist möglicherweise defekt oder die Seite wurde eventuell
          entfernt. Überprüfe, ob du den richtigen Link eingegeben hast.
        </div>

        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Link id="login-btn" type="submit" className="link" to={'/'}>
            Hungrig?
          </Link>
        </div>
      </div>
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

export default PageNotFound;
