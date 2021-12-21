import React from 'react';
import FavouriteMeal from './FavouriteMeal';
import { Snackbar } from '@mui/material';

class Favourites extends React.Component {
  constructor(props) {
    super(props);
    this.state = { renderMeal: true };
    this.handleMealUnmount = this.handleMealUnmount.bind(this);
  }

  handleMealUnmount() {
    this.setState({ renderMeal: false });
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
        {this.props.user.favoriteMeals.length > 0 ? (
          this.props.user.favoriteMeals.map(meal => {
            if (this.props.user.preferences === 'alles') {
              return (
                <div style={{ marginBottom: 20 }} key={meal.id}>
                  <FavouriteMeal
                    meal={meal}
                    user={this.props.user}
                    deactivated={false}
                    unmountMeal={this.handleMealUnmount}
                  />
                </div>
              );
            } else {
              return (
                <div style={{ marginBottom: 20 }} key={meal.id}>
                  <FavouriteMeal
                    meal={meal}
                    user={this.props.user}
                    deactivated={
                      !this.preferredMeal(
                        this.props.user.preferences,
                        meal.notes
                      )
                    }
                    unmountMeal={this.handleMealUnmount}
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
            Keine Lieblingsgerichte vorhanden
          </div>
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

export default Favourites;
