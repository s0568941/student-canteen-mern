import React from 'react';
import MensaWahl from './MensaWahl';
import SearchIcon from '@material-ui/icons/Search';
import { Container } from 'reactstrap';
import { Snackbar } from '@mui/material';
import { missingResourcesInfo } from '../styles/styles';

class MyMensa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      canteen: '',
      address: '',
      canteens: [],
      canteenId: -1,
    };
  }

  onChange = e => this.setState({ [e.target['id']]: e.target.value });

  componentDidMount() {
    if (typeof this.props.canteens !== 'undefined') {
      let chosenCanteen = [];
      if (typeof this.props.user?.canteen !== 'undefined') {
        chosenCanteen = this.props.canteens.filter(
          canteen => canteen.id === this.props.user.canteen
        );
      }
      const canteens =
        this.props.canteens.length > 100
          ? this.props.canteens.slice(0, 99)
          : this.props.canteens;
      if (chosenCanteen.length > 0)
        this.setState({
          canteens,
          canteen: chosenCanteen[0]?.name,
          address: chosenCanteen[0]?.address,
          canteenCoords: chosenCanteen[0]?.coordinates,
          canteenId: chosenCanteen[0]?.id,
        });
      else {
        this.setState({ canteens });
      }
    }
  }

  setCanteen = canteen => {
    this.setState({
      canteenId: canteen.id,
      canteen: canteen.name,
      address: canteen.address,
      canteenCoords: canteen.coordinates,
    });
    if (navigator.onLine) {
      this.props.setCanteen(canteen);
    } else {
      const store = localStorage.getItem('mensa');
      if (store === null) {
        localStorage.setItem('mensa', JSON.stringify([canteen]));
      } else {
        localStorage.removeItem('mensa');
        localStorage.setItem('mensa', JSON.stringify([canteen]));
      }
    }
  };

  componentDidUpdate(prevProps) {
    if (
      typeof this.props.canteens !== 'undefined' &&
      typeof this.props.user !== 'undefined' &&
      this.props.user.canteen !== prevProps.user.canteen &&
      this.state.canteenId !== this.props.user.canteen
    ) {
      let chosenCanteen = [];
      if (this.props.user.canteen) {
        chosenCanteen = this.props.canteens.filter(
          canteen => canteen.id === this.props.user.canteen
        );
      }
      if (chosenCanteen.length > 0) {
        this.setState({
          canteen: chosenCanteen[0]?.name,
          address: chosenCanteen[0]?.address,
          canteenId: chosenCanteen[0]?.id,
          canteenCoords: chosenCanteen[0]?.coordinates,
        });
      }
    }
    if (
      typeof this.props.canteens !== 'undefined' &&
      prevProps.canteens !== this.props.canteens
    ) {
      this.setState({ canteens: this.props.canteens });
    }
    if (
      typeof this.props.canteens !== 'undefined' &&
      prevProps.canteens !== this.props.canteens &&
      typeof this.props.user !== 'undefined' &&
      this.state.canteenId !== this.props.user.canteen
    ) {
      let chosenCanteen = [];
      if (this.props.user.canteen) {
        chosenCanteen = this.props.canteens.filter(
          canteen => canteen.id === this.props.user.canteen
        );
      }
      if (chosenCanteen.length > 0) {
        this.setState({
          canteens: this.props.canteens,
          canteen: chosenCanteen[0]?.name,
          address: chosenCanteen[0]?.address,
          canteenCoords: chosenCanteen[0]?.coordinates,
          canteenId: chosenCanteen[0]?.id,
        });
      } else {
        this.setState({ canteens: this.props.canteens });
      }
    }
  }

  render() {
    return (
      <>
        <div
          id={'mensensuche-container'}
          style={{
            backgroundColor: '#87F6C1',
            height: '100%',
            display: 'block',
          }}
        >
          <div
            style={{
              alignContent: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white' }}>Meine Mensa</span>
          </div>

          <div
            style={{
              width: '100%',
              alignContent: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}
          >
            <MensaWahl
              key={
                this.props.user?.canteen
                  ? this.props.user.canteen
                  : this.state.canteenId
              }
              canteen={this.state.canteen}
              address={this.state.address}
              coords={this.state.canteenCoords}
              originCoords={this.props.originCoords}
            />
          </div>

          <div
            style={{
              alignContent: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white' }}>Nächste Mensa:</span>
          </div>

          <div
            style={{
              backgroundColor: 'white',
              width: '100%',
              display: 'inline-flex',
            }}
          >
            <SearchIcon style={{ marginLeft: 5, color: 'grey' }} />
            <input
              id={'search'}
              placeholder={'Suchen'}
              onChange={this.onChange}
              style={{ width: '100%', color: 'grey', border: 'none' }}
            />
          </div>

          {this.state.canteens.length > 0 ? (
            this.state.canteens
              .filter(
                canteen =>
                  this.state.search === '' ||
                  canteen.name.toLowerCase().includes(this.state.search)
              )
              .map(canteen => {
                return (
                  <div
                    key={canteen.id}
                    style={{
                      cursor: 'pointer',
                      width: '100%',
                      alignContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#87F6C1',
                      boxShadow: 3,
                    }}
                    onClick={() => this.setCanteen(canteen)}
                  >
                    <MensaWahl
                      canteen={canteen.name}
                      address={canteen.address}
                      coords={canteen.coordinates}
                      originCoords={this.props.originCoords}
                    />
                  </div>
                );
              })
          ) : (
            <Container
              style={{
                height: '100%',
                width: '100%',
                alignContent: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div>
                <img
                  src="location.png"
                  style={{ width: 200, height: 200, margin: 10 }}
                  id="icon"
                  alt="Location"
                />
                <h3 style={missingResourcesInfo}>
                  Bist du dir sicher, dass du mir deinen Standort nicht verraten
                  willst?
                </h3>
              </div>
            </Container>
          )}
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
      </>
    );
  }
}

export default MyMensa;
