import React from 'react';
import { List } from 'reactstrap';
import LocationOnIcon from '@mui/icons-material/LocationOn';

class MensaWahl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canteen: this.props.canteen ? this.props.canteen : '',
      address: this.props.address ? this.props.address : '',
      coords: this.props.coords ? this.props.coords : '',
    };
  }

  // CSS
  disabledAnkerTag = {
    pointerEvents: 'none',
    cursor: 'default',
  };

  // Source Code: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  calcDistance() {
    var lat1 = this.props.originCoords.latitude;
    var lon1 = this.props.originCoords.longitude;
    var lat2 = this.state.coords[0];
    var lon2 = this.state.coords[1];

    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  toRad(Value) {
    return (Value * Math.PI) / 180;
  }

  componentDidUpdate(prevProps) {
    if (
      typeof this.props.canteen !== 'undefined' &&
      this.props.canteen !== prevProps.canteen
    ) {
      this.setState({
        canteen: this.props.canteen,
        address: this.props.address,
      });
    }
    if (
      typeof this.props.canteen !== 'undefined' &&
      this.props.originCoords !== prevProps.originCoords
    ) {
      this.setState({ originCoords: this.props.originCoords });
    }
    if (
      typeof this.props.canteen !== 'undefined' &&
      this.props.coords !== prevProps.coords
    ) {
      this.setState({ coords: this.props.coords });
    }
  }

  render() {
    document.getElementById('root').style.backgroundColor = '#87F6C1';

    return (
      <List
        type="unstyled"
        style={{ width: '100%', textAlign: 'center', backgroundColor: 'white' }}
      >
        <li style={{ marginBottom: -8, marginTop: 8 }}>
          {this.state.canteen.length > 0
            ? this.state.canteen
            : 'Keine Mensa bisher ausgesucht'}
          {this.props.originCoords && this.state.coords.length > 0 ? (
            <span
              style={{
                textAlign: 'right',
                alignContent: 'right',
                justifyContent: 'right',
                display: 'inline-block',
              }}
            >
              <LocationOnIcon /> {' ' + this.calcDistance().toFixed(2) + 'km'}
            </span>
          ) : (
            ''
          )}
        </li>
        <hr />
        <li style={{ marginTop: -8, marginBottom: 8 }}>
          {this.state.address.length > 0 ? (
            <a
              target={'_blank'}
              rel={'noopener noreferrer'}
              href={`https://google.com/maps/place/${this.state.coords[0]},${this.state.coords[1]}`}
              style={
                this.state.coords.length === 0 ? this.disabledAnkerTag : {}
              }
            >
              {this.state.address}
            </a>
          ) : (
            'Suche eine Mensa aus und erhalte Benachrichtigungen'
          )}
        </li>
      </List>
    );
  }
}

export default MensaWahl;
