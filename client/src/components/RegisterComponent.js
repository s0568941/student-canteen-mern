import React from 'react';
import { registerRoute } from '../constants';
import './AuthComponent.css';
import { Alert } from '@mui/material';
import { Snackbar } from '@mui/material';

class RegisterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confPassword: '',
      usernameHint: false,
      usernameExistsHint: false,
      passwordHint: false,
      confPasswordHint: false,
      validPasswordsHint: false,
      registerSucceeded: false,
      error: false,
      connectionError: false,
    };
  }

  // CSS Styles:
  welcomeHeadingStyle = {
    textAlign: 'center',
    marginBottom: '3em',
    marginTop: '1em',
    paddingTop: '3em',
    paddingBottom: '-5em',
  };

  fieldHintStyle = {
    color: 'red',
    fontWeight: 'bold',
  };

  navToLogin = () => {
    this.props.onNavToLogin();
  };

  resetInputFields = () => {
    this.setState(RegisterComponent.defaultProps);
  };

  resetHints = () => {
    this.setState({
      usernameHint: false,
      usernameExistsHint: false,
      passwordHint: false,
      confPasswordHint: false,
      validPasswordsHint: false,
    });
  };

  checkFieldLength = () => {
    const username = this.state.username;
    const password = this.state.password;
    const confPassword = this.state.confPassword;
    if (username.length < 3 || username.length > 20) {
      this.setState({ usernameHint: true });
    }
    if (password.length < 5) {
      this.setState({ passwordHint: true });
    }
    if (confPassword.length < 5) {
      this.setState({ confPasswordHint: true });
    }
  };

  register = () => {
    const username = this.state.username;
    const password = this.state.password;
    const confPassword = this.state.confPassword;

    fetch(registerRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        confPassword,
      }),
    })
      .then(res => res.json())
      .then(data => {
        const registerSucceeded = data['success'];
        if (registerSucceeded) {
          this.setState({ registerSucceeded: true });
          window.scrollTo(0, 0);
        } else if (
          typeof data['requiredFields'] !== 'undefined' &&
          data['requiredFields'].length > 0
        ) {
          this.resetHints();
          data['requiredFields'].forEach(field => {
            if (field !== null) {
              if (field.toLowerCase() === 'username') {
                this.setState({ usernameHint: true });
              } else if (field.toLowerCase() === 'passwort') {
                this.setState({ passwordHint: true });
              } else {
                this.setState({ confPasswordHint: true });
              }
            }
          });
        } else if (!data['validPasswords'] && !data['userExists']) {
          // when passwords do not match
          this.resetHints();
          this.setState({ validPasswordsHint: true });
        } else if (data['userExists']) {
          this.resetHints();
          this.setState({
            ...RegisterComponent.defaultProps,
            usernameExistsHint: true,
          });
          this.resetInputFields();
        } else if (data['error']) {
          this.setState({ error: true });
        }
      })
      .catch(err => {
        this.setState({ connectionError: true });
        window.scrollTo(0, 0);
      });
  };

  onKeyPress = e => {
    if (e.key === 'Enter') this.register();
  };

  onChange = e => {
    this.setState({ [e.target['name']]: e.target.value });
  };

  render() {
    document.getElementById('root').style.backgroundColor = 'white';
    return (
      <div id="register-area">
        {this.state.connectionError && (
          <Alert
            role={'alert'}
            color={'error'}
            onClose={() => this.props.onNavToLogin()}
          >
            Es ist ein Fehler bei der Kommunikation mit dem Server aufgetreten.
          </Alert>
        )}
        {this.state.error && (
          <Alert
            role={'alert'}
            color={'error'}
            onClose={() => this.props.onNavToLogin()}
          >
            Es ist ein Fehler aufgetreten. Bitte versuche es erneut.
          </Alert>
        )}
        {this.state.registerSucceeded && (
          <Alert
            role={'alert'}
            color={'success'}
            onClose={() => this.props.onNavToLogin()}
          >
            Registrierung erfolgreich
          </Alert>
        )}
        <div style={this.welcomeHeadingStyle}>
          <h1>Willkommen zu Waiter!</h1>
        </div>

        {/* Source of bootstrap snippet: https://bootsnipp.com/snippets/dldxB */}
        <div className="wrapper fadeInDown">
          <div id="formContent">
            {/*{!--Icon--}*/}
            <div className="fadeIn first">
              <img
                src="authentication.png"
                style={{
                  width: 100,
                  height: 100,
                  marginTop: 10,
                  marginBottom: 10,
                }}
                id="icon"
                alt="Passwort Icon"
              />
            </div>
            <div>
              <input
                type="text"
                id="registerUser"
                className="fadeIn second register-input"
                placeholder="Username"
                name="username"
                onKeyPress={this.onKeyPress}
                value={this.state.username}
                onChange={this.onChange}
              ></input>
              <span
                style={
                  this.state.usernameHint || this.state.usernameExistsHint
                    ? this.fieldHintStyle
                    : {}
                }
              >
                {this.state.usernameHint && this.state.username.length === 0 && (
                  <>
                    <label>Dieses Feld wird benötigt.</label>
                    <br />
                  </>
                )}
                {this.state.usernameExistsHint && (
                  <>
                    <label>Username ist bereits vergeben.</label>
                    <br />
                  </>
                )}
                {!this.state.usernameExistsHint && (
                  <>
                    <label>Minimale Länge: 3</label>
                    <br />
                    <label>Maximale Länge: 20</label>
                  </>
                )}
              </span>
              <br />
              <input
                type="password"
                id="register-pw"
                className="fadeIn third register-input"
                placeholder="Passwort"
                name="password"
                onKeyPress={this.onKeyPress}
                value={this.state.password}
                onChange={this.onChange}
              ></input>
              <span style={this.state.passwordHint ? this.fieldHintStyle : {}}>
                {this.state.passwordHint && this.state.password.length === 0 && (
                  <>
                    <label>Dieses Feld wird benötigt.</label>
                    <br />
                  </>
                )}
                <label>Minimale Länge: 5</label>
              </span>
              <br />
              <input
                type="password"
                id="register-pw-confirm"
                className="fadeIn third register-input"
                placeholder="Passwort bestätigen"
                name="confPassword"
                onKeyPress={this.onKeyPress}
                value={this.state.confPassword}
                onChange={this.onChange}
              ></input>
              <span
                style={
                  this.state.confPasswordHint || this.state.validPasswordsHint
                    ? this.fieldHintStyle
                    : {}
                }
              >
                {this.state.confPasswordHint &&
                  this.state.confPassword.length === 0 && (
                    <>
                      <label>Dieses Feld wird benötigt.</label>
                      <br />
                    </>
                  )}
                {!this.state.validPasswordsHint && (
                  <label>Minimale Länge: 5</label>
                )}
                {this.state.validPasswordsHint && (
                  <>
                    <label>Passwörter stimmen nicht überein.</label>
                    <br />
                  </>
                )}
              </span>
              <br />
              <hr />
            </div>

            <div>
              <input
                id="register-btn"
                type="submit"
                className="fadeIn fourth"
                value="Registrieren"
                onClick={this.register}
              ></input>
            </div>

            <div id="formFooter">
              <a className="underlineHover" onClick={this.navToLogin} href="#">
                Bereits registriert?
              </a>
            </div>
          </div>
        </div>
        {typeof this.props.openSnackbar === 'boolean' && (
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

RegisterComponent.defaultProps = {
  username: '',
  password: '',
  confPassword: '',
};

export default RegisterComponent;
