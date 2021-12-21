import React from 'react';
import { loginRoute } from '../constants';
import './AuthComponent.css';
import { Alert } from '@mui/material';
import { Snackbar } from '@mui/material';

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      loginHint: false,
      message: '',
      connectionError: false,
    };
  }

  // CSS Styles:
  welcomeHeadingStyle = {
    textAlign: 'center',
    marginBottom: '-6em',
    marginTop: '1em',
    paddingTop: '3em',
    paddingBottom: '-5em',
  };

  fieldHintStyle = {
    color: 'red',
    fontWeight: 'bold',
  };

  navToRegister = () => {
    this.props.onNavToRegister();
  };

  login = () => {
    const username = this.state.login;
    const password = this.state.password;

    fetch(loginRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        this.resetInputFields();
        const loginSucceeded = data['success'];
        if (loginSucceeded) {
          this.props.onLoginSuccess(data.user);
        } else {
          const message = 'Username oder Passwort inkorrekt.';
          this.setState({ message, loginHint: true });
          this.resetInputFields();
        }
      })
      .catch(err => {
        this.setState({ connectionError: true });
        window.scrollTo(0, 0);
      });
  };

  onKeyPress = e => {
    if (e.key === 'Enter') this.login();
  };

  onChange = e => this.setState({ [e.target['id']]: e.target.value });

  resetInputFields = () => this.setState(LoginComponent.defaultProps);

  render() {
    document.getElementById('root').style.backgroundColor = 'white';
    return (
      <div id="login-area-component">
        {this.state.connectionError && (
          <Alert
            role={'alert'}
            color={'error'}
            onClose={() => this.setState({ connectionError: false })}
          >
            Es ist ein Fehler bei der Kommunikation mit dem Server aufgetreten.
          </Alert>
        )}
        <div id="welcome-heading" style={this.welcomeHeadingStyle}>
          <h1>Willkommen zu Waiter!</h1>
        </div>

        {/* Source of bootstrap snippet: https://bootsnipp.com/snippets/dldxB */}
        <div className="wrapper fadeInDown">
          <div id="formContent">
            {/*{Icon}*/}
            <div className="fadeIn first">
              {/* image source: https://www.clipartmax.com/middle/m2i8m2K9K9d3N4G6_how-to-change-your-account-password-password-icon-png-green/ */}
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

            {/*{!--Login Form --}*/}
            <div>
              <input
                type="text"
                id="login"
                className="fadeIn second login-input"
                placeholder="Username"
                name="username"
                onKeyPress={this.onKeyPress}
                value={this.state.login}
                onChange={this.onChange}
              ></input>
              <br />
              <input
                type="password"
                id="password"
                className="fadeIn third login-input"
                placeholder="Passwort"
                name="password"
                onKeyPress={this.onKeyPress}
                value={this.state.password}
                onChange={this.onChange}
              ></input>
              <span style={this.state.loginHint ? this.fieldHintStyle : {}}>
                {this.state.loginHint && (
                  <>
                    <label>{this.state.message}</label>
                  </>
                )}
              </span>
              <br />
              <input
                id="login-btn"
                type="submit"
                className="fadeIn fourth"
                value="Login"
                onClick={this.login}
              ></input>
            </div>

            <div id="formFooter">
              <a
                className="underlineHover"
                onClick={this.navToRegister}
                href="#"
              >
                Noch nicht registriert?
              </a>
            </div>
          </div>
        </div>
        {typeof this.props.openSnackbar !== 'boolean' ? (
          <></>
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

LoginComponent.defaultProps = {
  login: '',
  password: '',
  connectionError: false,
};

export default LoginComponent;
