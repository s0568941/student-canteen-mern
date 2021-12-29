import React from 'react';
import Meal from './Meal';
import { Container } from 'reactstrap';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Snackbar } from '@mui/material';
import { missingResourcesInfo } from '../styles/styles';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      today: this.getToday(),
      meals: [null, null, null, null, null],
      canteenId: this.props.user.canteen,
    };
  }

  getToday = () => {
    let today = new Date().getDay() - 1;
    return today;
  };

  fetchMeals = (weekDay, date) => {
    function handleErrors(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }
    const mealsRoute = `https://openmensa.org/api/v2/canteens/${this.props.user.canteen}/days/${date}/meals`;
    fetch(mealsRoute, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(data => {
        if (data.length > 0) {
          setTimeout(() => {
            let weekMeals = this.state.meals;
            weekMeals[weekDay] = data;
            this.setState(weekMeals);
          }, 1500);
        }
      })
      .catch(error => {
        let weekMeals = this.state.meals;
        weekMeals[weekDay] = '';
        this.setState(weekMeals);
      });
  };

  componentDidMount() {
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      this.fetchMeals(i, today.toLocaleDateString('en-CA'));
      today.setDate(today.getDate() + 1);
    }
  }

  handleWeekdaySubmit(day) {
    this.setState({ today: day });
  }

  preferredMeal(preference, mealNotes) {
    for (var i = 0; i < mealNotes.length; i++) {
      if (mealNotes[i].toLowerCase().match(preference)) return true;
      else if (preference.match('vegetarisch')) {
        if (mealNotes[i].toLowerCase().match('vegan')) return true;
      }
    }
    return false;
  }

  render() {
    document.getElementById('root').style.backgroundColor = 'white';
    return (
      <div>
        <ButtonGroup
          variant="text"
          aria-label="button group"
          style={{
            background: '#87F6C1',
            textAlign: 'center',
            display: 'flex',
            marginTop: -25,
            marginBottom: '1.5em',
            borderBottom: '2px solid white',
          }}
        >
          <Button
            sx={{ color: 'white', fontSize: 15, width: '20%' }}
            onClick={() => this.handleWeekdaySubmit(0)}
          >
            MO
          </Button>
          <Button
            sx={{ color: 'white', fontSize: 15, width: '20%' }}
            onClick={() => this.handleWeekdaySubmit(1)}
          >
            DI
          </Button>
          <Button
            sx={{ color: 'white', fontSize: 15, width: '20%' }}
            onClick={() => this.handleWeekdaySubmit(2)}
          >
            MI
          </Button>
          <Button
            sx={{ color: 'white', fontSize: 15, width: '20%' }}
            onClick={() => this.handleWeekdaySubmit(3)}
          >
            DO
          </Button>
          <Button
            sx={{ color: 'white', fontSize: 15, width: '20%' }}
            onClick={() => this.handleWeekdaySubmit(4)}
          >
            FR
          </Button>
        </ButtonGroup>
        {this.state.meals[0] != null &&
        this.state.meals[1] != null &&
        this.state.meals[2] != null &&
        this.state.meals[3] != null &&
        this.state.meals[4] != null ? (
          this.state.meals[0] &&
          !(this.state.today === 5 || this.state.today === -1) &&
          this.state.meals[this.state.today] !== '' ? (
            this.state.meals[this.state.today].map(meal => {
              if (this.props.user.preferences === 'alles') {
                return (
                  <div style={{ marginBottom: 15 }} key={meal.id}>
                    <Meal
                      meal={meal}
                      user={this.props.user}
                      deactivated={false}
                    />
                  </div>
                );
              } else if (this.props.user.preferencesSettings === 'ausblenden') {
                if (
                  this.preferredMeal(this.props.user.preferences, meal.notes)
                ) {
                  return (
                    <div style={{ marginBottom: 15 }} key={meal.id}>
                      <Meal
                        meal={meal}
                        user={this.props.user}
                        deactivated={false}
                      />
                    </div>
                  );
                }
              } else {
                return (
                  <div style={{ marginBottom: 15 }} key={meal.id}>
                    <Meal
                      meal={meal}
                      user={this.props.user}
                      deactivated={
                        !this.preferredMeal(
                          this.props.user.preferences,
                          meal.notes
                        )
                      }
                    />
                  </div>
                );
              }
            })
          ) : (
            <div
              style={{
                width: '100%',
                alignContent: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#87F6C1',
              }}
            >
              Die Mensa ist geschlossen
            </div>
          )
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
                src="hungry.png"
                style={{
                  width: '100%',
                  height: '100%',
                  margin: 0,
                  marginBottom: 10,
                }}
                id="icon"
                alt="Hungry person"
              />
              <h3 style={missingResourcesInfo}>
                Die Mensa hat leider aktuell nichts zu essen
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
    );
  }
}

export default Home;
