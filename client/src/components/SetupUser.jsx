import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import { Snackbar } from '@mui/material';

class SetupUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: 'student',
      preferences: 'alles',
      preferencesSettings: 'kennzeichnen',
    };
  }

  handleChangeRole = event => {
    this.setState({ role: event.target.value });
  };

  handleChangePreferences = event => {
    this.setState({ preferences: event.target.value });
  };

  handleChangePreferencesSettings = event => {
    this.setState({ preferencesSettings: event.target.value });
  };

  handleSubmit = () => {
    this.props.updateUser(
      this.state.preferences,
      this.state.preferencesSettings,
      this.state.role
    );
  };

  render() {
    const style = {
      firstText: {
        marginLeft: '0.5em',
        marginRight: '0.5em',
      },
      text: {
        marginLeft: '0.5em',
        marginRight: '0.5em',
        marginTop: '1.5em',
      },
      button: {
        textAlign: 'center',
        marginTop: '1.5em',
      },
      formControl: {
        width: '100%',
      },
    };
    return (
      /*{!--Settings Form --}*/
      <div style={{ paddingLeft: '5%', paddingRight: '5%' }}>
        <div style={style.firstText}>
          Um direkt loslegen zu können, brauchen wir noch ein paar
          Informationen:
        </div>
        <div style={style.text}>Ich bin</div>
        <div>
          <FormControl variant="filled" style={style.formControl}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.role}
              onChange={this.handleChangeRole}
            >
              <MenuItem value={'student'}>Student/in</MenuItem>
              <MenuItem value={'arbeitnehmer'}>Arbeitnehmer/in</MenuItem>
              <MenuItem value={'keine auswahl'}>Keine Auswahl</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={style.text}>Ich esse</div>
        <div>
          <FormControl variant="filled" style={style.formControl}>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={this.state.preferences}
              onChange={this.handleChangePreferences}
            >
              <MenuItem value={'alles'}>alles</MenuItem>
              <MenuItem value={'vegetarisch'}>vegetarisch</MenuItem>
              <MenuItem value={'vegan'}>vegan</MenuItem>
            </Select>
          </FormControl>
        </div>
        {this.state.preferences !== 'alles' ? (
          <div>
            <div style={style.text}>
              Nicht {this.state.preferences}e Gerichte
            </div>
            <FormControl variant="filled" style={style.formControl}>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={this.state.preferencesSettings}
                onChange={this.handleChangePreferencesSettings}
              >
                <MenuItem value={'kennzeichnen'}>kennzeichnen</MenuItem>
                <MenuItem value={'ausblenden'}>ausblenden</MenuItem>
              </Select>
            </FormControl>
          </div>
        ) : null}
        <div style={style.button}>
          <Link
            id="login-btn"
            type="submit"
            className="link"
            to={'/mymensa'}
            onClick={this.handleSubmit}
          >
            Weiter
          </Link>
        </div>
        {typeof this.props.openSnackbar !== 'boolean' ? (
          <Snackbar
            open={false}
            message="Keine Internetverbindung gefunden :("
            key={'state.Transition.name1'}
          />
        ) : (
          <Snackbar
            open={this.props.openSnackbar}
            message="Keine Internetverbindung gefunden :("
            key={'state.Transition.name1'}
          />
        )}
      </div>
    );
  }
}

export default SetupUser;
