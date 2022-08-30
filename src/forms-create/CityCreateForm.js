import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { TextField, Select } from 'final-form-material-ui';
import { Paper, Grid, Button, MenuItem, withStyles } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { createData } from '../helpers';
import styles from '../styles/CityCreateFormStyles';

function CityCreateForm({
  // city data
  classes,
  cities,
  countries,
  setCities,
  citiesGetURL,
  cityCreateURL,
  // set validation modes
  cityResetMode,
  setCityResetMode,
  resetMode,
  setResetMode,
  // show|hide create form or table
  setShowCityTable,
  showCityCreateForm,
  setShowCityCreateForm,
  setRenderedData,
}) {
  const validate = (values) => {
    const errors = {};
    if (!values.cityName && cityResetMode === false) {
      errors.cityName = 'City is required';
    }
    if (cityAlreadyExist.length > 0) {
      errors.cityName = 'City already exist!';
    }
    if (!values.country && resetMode === false) {
      errors.country = 'Country is required';
    }
    return errors;
  };
  const [cityAlreadyExist, setCityAlreadyExist] = useState([]);

  // main create function - onSubmit form
  const createNewCity = (values) => {
    const [cityCountry] = countries.filter((c) => c.name === values.country);
    const { cityName, country } = values;
    const id = uuidv4();
    if (cityName && country) {
      const newCity = {
        id,
        name: cityName,
        countryId: cityCountry.id,
        country: {
          name: country,
          id: cityCountry.id,
        },
      };
      // insert new city
      createData(citiesGetURL, setCities, cityCreateURL, newCity);
      // reset selected data
      setCityAlreadyExist([]);
      // hide city create form, show its table
      setShowCityCreateForm(false);
      setShowCityTable(true);
      setRenderedData('cities-rendered');
      console.log(newCity);
    }
  };

  const controlCityExist = (val) => {
    const sameCities = cities.filter((city) => {
      return (
        city.name && city.name.trim().toLowerCase() === val.trim().toLowerCase()
      );
    });
    setCityAlreadyExist(sameCities);
  };

  // reset validations to show
  const handleCountriesSelect = () => {
    setResetMode(false);
  };
  const handleCityClicked = () => {
    setCityResetMode(false);
  };

  const handleCancelButton = () => {
    // reset update data
    setCityAlreadyExist([]);
    // show supplier table
    setShowCityCreateForm(false);
    setShowCityTable(true);
    setRenderedData('cities-rendered');
  };

  const getCountriesMenu = () => {
    return countries.map((country) => (
      <MenuItem key={country.id} value={country.name}>
        {country.name}
      </MenuItem>
    ));
  };

  return (
    <div
      style={{ padding: 16, margin: 'auto', maxWidth: 600 }}
      className={showCityCreateForm ? classes.Show : classes.Hide}
    >
      <div>
        <Form
          onSubmit={(data) => createNewCity(data)}
          validate={validate}
          render={({ form, handleSubmit, submitting }) => (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={classes.CityCreateForm}
            >
              <Paper style={{ padding: '16px 16px 56px 16px' }}>
                <Grid container alignItems='flex-start' spacing={8}>
                  <h2
                    style={{
                      margin: '10px auto 0 35px',
                      paddingTop: '25px',
                      paddingBottom: '10px',
                      fontWeight: '300',
                    }}
                  >
                    City Create Form
                  </h2>
                  <Grid
                    item
                    xs={12}
                    onChange={(e) => controlCityExist(e.target.value)}
                  >
                    <Field
                      fullWidth
                      name='cityName'
                      component={TextField}
                      label='City name'
                      onClick={() => handleCityClicked()}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.SelectCountry}>
                    <Field
                      fullWidth
                      name='country'
                      component={Select}
                      label='Select a Country'
                      onClick={() => handleCountriesSelect()}
                      formControlProps={{ fullWidth: true }}
                    >
                      {getCountriesMenu()}
                    </Field>
                  </Grid>
                  <Grid
                    item
                    style={{ marginTop: 16 }}
                    xs={12}
                    className={classes.Buttons}
                  >
                    <Button
                      className={
                        classes.FormButtons + ' ' + classes.CityCancelButton
                      }
                      variant='contained'
                      type='cancel'
                      onClick={() => {
                        handleCancelButton();
                        form.reset();
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className={
                        classes.FormButtons + ' ' + classes.CityFormButtons
                      }
                      variant='contained'
                      type='submit'
                      disabled={submitting}
                      onClick={() => {
                        setResetMode(false);
                        !showCityCreateForm && form.reset();
                        setTimeout(() => {
                          form.reset();
                        }, 1000);
                      }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </form>
          )}
        />
      </div>
    </div>
  );
}

export default withStyles(styles)(CityCreateForm);
