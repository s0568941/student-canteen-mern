import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { Snackbar } from '@mui/material';

const dbName = 'notifications';
const dbVersion = 1;
const objectStoreName = 'normalPush';

class Lifestyle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: props.user.role,
      preferences: props.user.preferences,
      preferencesSettings: props.user.preferencesSettings,
      notificationEnabled: props.user.pushNotificationsEnabled,
      morningUpdateNotif: props.user.morningUpdateNotif,
    };
  }

  handleChangeRole = event => {
    this.setState({ role: event.target.value });
    this.props.updateUser(
      this.state.preferences,
      this.state.preferencesSettings,
      event.target.value
    );
  };

  handleChangePreferences = event => {
    this.setState({ preferences: event.target.value });
    this.props.updateUser(
      event.target.value,
      this.state.preferencesSettings,
      this.state.role
    );
  };

  handleChangePreferencesSettings = event => {
    this.setState({ preferencesSettings: event.target.value });
    this.props.updateUser(
      this.state.preferences,
      event.target.value,
      this.state.role
    );
  };

  updateNotificationIDB = (
    enabled,
    normalNotifEnabled,
    morningNotifEnabled
  ) => {
    let db;
    const request = window.indexedDB.open(dbName, dbVersion);
    request.onsuccess = event => {
      db = request.result;
      const tx = db.transaction(objectStoreName, 'readwrite');
      tx.onerror = event => {
        console.log('Error while clearing data: ', event);
      };

      const objStore = tx.objectStore(objectStoreName);

      // Make a request to clear all the data out of the object store
      var clearObjectStoreRequest = objStore.clear();

      clearObjectStoreRequest.onsuccess = function (event) {
        const tx = db.transaction(objectStoreName, 'readwrite');
        const notifications = tx.objectStore(objectStoreName);
        if (enabled === 4) {
          const normalPushEnabled = normalNotifEnabled === true ? 1 : 0;
          notifications.add({ enabled: normalPushEnabled });
        } else if (morningNotifEnabled) {
          notifications.add({ enabled: 4 });
        }
        notifications.add({ enabled: enabled });
      };
    };
  };

  handleChangeMorningPushSwitch = event => {
    // update notification in IndexedDB
    // number 4 === morning updates
    if (!this.state.morningUpdateNotif) {
      this.updateNotificationIDB(
        4,
        this.state.notificationEnabled,
        !this.state.morningUpdateNotif
      );
    } else {
      const normalPushEnabled = this.state.notificationEnabled === true ? 1 : 0;
      this.updateNotificationIDB(
        normalPushEnabled,
        this.state.notificationEnabled,
        !this.state.morningUpdateNotif
      );
    }
    this.setState({ morningUpdateNotif: !this.state.morningUpdateNotif });
    this.props.user.morningUpdateNotif = this.state.morningUpdateNotif;
    this.props.updateUser(
      this.state.preferences,
      this.state.preferencesSettings,
      this.state.role,
      this.props.user.canteen,
      this.state.notificationEnabled,
      !this.state.morningUpdateNotif
    );
  };

  handleChangePushSwitch = event => {
    // update notification in IndexedDB
    // number 1 === normal push notification (for demo - every start of the app)
    const normalPushEnabled = !this.state.notificationEnabled === true ? 1 : 0;
    this.updateNotificationIDB(
      normalPushEnabled,
      !this.state.notificationEnabled,
      this.state.morningUpdateNotif
    );
    this.setState({ notificationEnabled: !this.state.notificationEnabled });
    this.props.updateUser(
      this.state.preferences,
      this.state.preferencesSettings,
      this.state.role,
      this.props.user.canteen,
      !this.state.notificationEnabled
    );
  };

  componentDidUpdate(prevProps) {
    if (
      typeof this.props.user.pushNotificationsEnabled !== 'undefined' &&
      this.props.user.pushNotificationsEnabled !==
        prevProps.user.pushNotificationsEnabled
    ) {
      this.setState({
        notificationEnabled: this.props.user.notificationEnabled,
      });
    }
    if (
      typeof this.props.user.morningUpdateNotif !== 'undefined' &&
      this.props.user.morningUpdateNotif !== prevProps.user.morningUpdateNotif
    ) {
      this.setState({ morningUpdateNotif: this.props.user.morningUpdateNotif });
    }
  }

  render() {
    document.getElementById('root').style.backgroundColor = 'white';
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
        <div style={style.firstText}>Ich bin</div>
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
        <div
          style={{
            borderBottom: 'solid',
            borderTop: 'solid',
            paddingTop: '0.8em',
            paddingBottom: '0.8em',
            marginTop: '0.5em',
            paddingBottom: '2.9em',
          }}
        >
          <div>
            <div style={{ float: 'left', width: '75%', marginLeft: '0.5em' }}>
              Push Benachrichtigungen
            </div>

            <div style={{ float: 'right', width: '20%' }}>
              <Switch
                checked={this.state.notificationEnabled}
                onChange={this.handleChangePushSwitch}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          <br />
          <div style={{ height: '100%', marginBottom: '0.7em' }}>
            <div
              style={{
                float: 'left',
                width: '75%',
                marginLeft: '0.5em',
                marginTop: '1em',
                marginBottom: '5em',
              }}
            >
              Morgendliches Menu
            </div>

            <div style={{ float: 'right', width: '20%' }}>
              <Switch
                checked={this.state.morningUpdateNotif}
                onChange={this.handleChangeMorningPushSwitch}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>
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

export default Lifestyle;
