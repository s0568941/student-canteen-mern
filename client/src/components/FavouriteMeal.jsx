import React from 'react';
import Box from '@mui/material/Box';
import { List } from 'reactstrap';
import { DeleteOutline } from '@mui/icons-material';
import { updateRoute } from '../constants';

class FavouriteMeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favourite: false,
      hideNotes: true,
    };
  }

  setPrice(meal) {
    if (this.props.user.role === 'student') {
      return meal.prices['students'];
    } else if (this.props.user.role === 'arbeitnehmer') {
      return meal.prices['employees'];
    } else {
      return meal.prices['others'];
    }
  }

  offlineMealUpdate = () => {
    let offlineMeals = localStorage.getItem('removeMeals');
    if (offlineMeals === null) return;
    offlineMeals = Array.isArray(JSON.parse(offlineMeals))
      ? JSON.parse(offlineMeals)
      : [...JSON.parse(offlineMeals)];
    offlineMeals.map(meal => {
      this.updateFavouriteMeals(meal.id, meal.name, meal.prices, meal.notes);
    });
    localStorage.removeItem('removeMeals');
  };

  componentDidUpdate() {
    window.addEventListener('online', () => this.offlineMealUpdate());
  }

  updateFavouriteMeals(id, name, prices, notes) {
    let updatedUser = this.props.user;
    if (navigator.onLine) {
      let index = updatedUser.favoriteMeals.findIndex(
        favoriteMeal => favoriteMeal.id === id
      );
      if (index > -1) {
        updatedUser.favoriteMeals.splice(index, 1);
      } else {
        updatedUser.favoriteMeals.push({
          id: id,
          name: name,
          prices,
          prices,
          notes: notes,
        });
      }
    }

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
      })
      .catch(err => {
        const store = localStorage.getItem('removeMeals');
        if (store === null) {
          localStorage.setItem(
            'removeMeals',
            JSON.stringify([{ id, name, prices, notes }])
          );
        } else {
          const storedMeals = [...JSON.parse(store)];
          let mealAlreadyStored = storedMeals.find(meal => meal.id === id);
          if (mealAlreadyStored === undefined) {
            localStorage.setItem(
              'removeMeals',
              JSON.stringify([
                ...JSON.parse(store),
                { id, name, prices, notes },
              ])
            );
          }
        }
      });
    this.props.unmountMeal();
  }

  hideNote = () => {
    this.state.hideNotes
      ? this.setState({ hideNotes: false })
      : this.setState({ hideNotes: true });
  };

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
    document.getElementById('root').style.backgroundColor = '#87F6C1';
    return (
      <div
        style={
          this.props.deactivated
            ? { width: '100%', opacity: 0.5 }
            : { width: '100%' }
        }
      >
        <div style={{ backgroundColor: 'black' }}>
          <Box sx={{ backgroundColor: 'white', boxShadow: 5 }}>
            <List type="unstyled" style={{ display: 'flex', boxShadow: 3 }}>
              <div>
                <DeleteOutline
                  sx={{ color: '#87F6C1', fontSize: 40, margin: '0.1em' }}
                  onClick={() =>
                    this.updateFavouriteMeals(
                      this.props.meal.id,
                      this.props.meal.name,
                      this.props.meal.prices,
                      this.props.meal.notes
                    )
                  }
                />
              </div>
              <div
                style={{
                  marginRight: '0.5em',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                }}
                onClick={this.hideNote}
              >
                {this.props.meal.name}
              </div>
              <div
                style={{
                  marginLeft: 'auto',
                  marginTop: 'auto',
                  marginRight: '0.2em',
                }}
              >
                {this.setPrice(this.props.meal)}€
              </div>
            </List>
            {this.state.hideNotes ? null : (
              <div
                style={{ marginTop: -15, borderTop: '1px solid black' }}
                onClick={this.hideNote}
              >
                {[...new Set(this.props.meal.notes)].map((note, index) => {
                  return (
                    <div key={index} style={{ marginLeft: '0.5em' }}>
                      {note}
                    </div>
                  );
                })}
              </div>
            )}
          </Box>
        </div>
      </div>
    );
  }
}

export default FavouriteMeal;
