import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import Header from './components/AppBar';
import Home from './components/Home';
import MyMensa from './components/MyMensa';
import Favourites from './components/Favourites';
import Lifestyle from './components/Lifestyle';
import Info from './components/Info';
import SetupUser from './components/SetupUser';
import { Snackbar } from '@mui/material';
import PageNotFound from './components/PageNotFound';

import Loader from 'react-loader-spinner';
import { Container } from 'reactstrap';
import {
  authStatusRoute,
  logOutRoute,
  openMensa,
  openMensaCanteen,
  openMensaV2,
  updateRoute,
} from './constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      registerView: false,
      loginView: false,
      checkedAuthStatus: false,
      user: '',
      canteens: [],
      originCoords: null,
      online: true,
    };
  }

  /**
   * Checks on initial loading whether a session exists and user is already signed in
   */
  checkAuthStatus = async () => {
    await fetch(authStatusRoute, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          this.setState({
            loggedIn: data.authenticated,
            checkedAuthStatus: true,
            user: data.user,
          });
        }, 1500);
      });
  };

  updateUser = (
    preferences,
    preferencesSettings,
    role,
    canteen,
    pushNotificationsEnabled,
    morningNotifEnabled
  ) => {
    let updatedUser = this.state.user;
    updatedUser.preferences = preferences;
    updatedUser.preferencesSettings = preferencesSettings;
    updatedUser.role = role;
    updatedUser.canteen = canteen;
    updatedUser.pushNotificationsEnabled =
      typeof pushNotificationsEnabled === 'undefined'
        ? updatedUser.pushNotificationsEnabled
        : pushNotificationsEnabled;
    updatedUser.morningUpdateNotif =
      typeof morningNotifEnabled === 'undefined'
        ? updatedUser.morningUpdateNotif
        : morningNotifEnabled;

    fetch(updateRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updatedUser,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({ user: data.user });
        }
      });
  };

  logOut = () => {
    fetch(logOutRoute, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/';
        }
      });
  };

  fetchCanteens = async (originCoords = null) => {
    let canteensRoute = `${openMensa}/${openMensaV2}/${openMensaCanteen}`;
    if (originCoords) {
      canteensRoute += `?near[lat]=${originCoords.latitude}&near[lng]=${originCoords.longitude}&near[dist]=10000`;
    }
    fetch(canteensRoute, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setTimeout(() => {
            this.setState({ canteens: data, originCoords });
            localStorage.setItem(
              'canteens',
              JSON.stringify(data, originCoords)
            );
          }, 1500);
        }
      });
  };

  async componentDidMount() {
    window.addEventListener('online', () => this.setState({ online: true }));
    window.addEventListener('offline', () => this.setState({ online: false }));
    await this.checkAuthStatus();
    if (!localStorage.getItem('canteens')) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
          await this.fetchCanteens(position.coords);
        });
      } else {
        await this.fetchCanteens();
      }
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
          this.setState({
            originCoords: position.coords,
            canteens: JSON.parse(localStorage.getItem('canteens')),
          });
        });
      } else {
        this.setState({
          canteens: JSON.parse(localStorage.getItem('canteens')),
        });
      }
    }
  }

  setCanteen = canteen => {
    const user = typeof this.state.user === 'object' ? this.state.user : {};
    user.canteen = canteen.id;
    this.updateUser(
      user.preferences,
      user.preferencesSettings,
      user.role,
      canteen.id
    );
  };

  render() {
    document.getElementById('root').style.backgroundColor = 'white';

    if (this.state.loggedIn) {
      if (!this.state.user.role) {
        return (
          <Router>
            <div>
              <Header onLogOut={() => this.logOut()} />
              <br />
              <SetupUser
                user={this.state.user}
                updateUser={this.updateUser}
                openSnackbar={!this.state.online}
              />
            </div>
          </Router>
        );
      } else {
        return (
          <Router>
            <div>
              <Header onLogOut={() => this.logOut()} />
              <br />
              <Switch>
                <Route exact path="/">
                  <Home
                    user={this.state.user}
                    openSnackbar={!this.state.online}
                  />
                </Route>
                <Route exact path="/mymensa">
                  <>
                    {this.state.canteens.length === 0 &&
                    typeof this.state.user.canteen === 'undefined' ? (
                      <Container
                        style={{
                          height: '100%',
                          width: '100%',
                          alignContent: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Loader
                          type="ThreeDots"
                          color="#87F6C1"
                          height={100}
                          width={100}
                        />

                        <Snackbar
                          open={!this.state.online}
                          message="Keine Internetverbindung gefunden :("
                          key={'state.Transition.name1'}
                        />
                      </Container>
                    ) : (
                      <MyMensa
                        canteens={this.state.canteens}
                        originCoords={this.state.originCoords}
                        setCanteen={this.setCanteen}
                        user={this.state.user}
                        openSnackbar={!this.state.online}
                      />
                    )}
                  </>
                </Route>

                <Route exact path="/favourites">
                  <Favourites
                    user={this.state.user}
                    openSnackbar={!this.state.online}
                  />
                </Route>
                <Route exact path="/lifestyle">
                  <Lifestyle
                    user={this.state.user}
                    updateUser={this.updateUser}
                    openSnackbar={!this.state.online}
                  />
                </Route>
                <Route
                  path="/info"
                  exact
                  component={Info}
                  openSnackbar={!this.state.online}
                />

                <Route
                  component={PageNotFound}
                  openSnackbar={!this.state.online}
                />
              </Switch>
            </div>
          </Router>
        );
      }
    } else if (this.state.registerView) {
      return (
        <>
          <RegisterComponent
            onNavToLogin={() =>
              this.setState({ ...App.defaultProps, loginView: true })
            }
            openSnackbar={!this.state.online}
          />
        </>
      );
    } else {
      return (
        <>
          {this.state.checkedAuthStatus ? (
            <>
              <LoginComponent
                style={{ marginTop: '115em' }}
                onLoginSuccess={user => {
                  this.setState({
                    ...App.defaultProps,
                    user: user,
                    loggedIn: true,
                  });
                  this.checkAuthStatus(); // for cache
                }}
                onNavToRegister={() =>
                  this.setState({ ...App.defaultProps, registerView: true })
                }
                openSnackbar={!this.state.online}
              />
            </>
          ) : (
            <Container
              style={{
                height: '100%',
                width: '100%',
                alignContent: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loader
                type="ThreeDots"
                color="#87F6C1"
                height={100}
                width={100}
              />
              <Snackbar
                open={!this.state.online}
                message="Keine Internetverbindung gefunden :("
                key={'state.Transition.name1'}
              />
            </Container>
          )}
        </>
      );
    }
  }
}

App.defaultProps = {
  loggedIn: false,
  registerView: false,
  loginView: false,
};

export default App;
