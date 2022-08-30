import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { TextField, Select } from 'final-form-material-ui';
import { Paper, Grid, Button, MenuItem, withStyles } from '@material-ui/core';
import { updateData } from '../helpers';
import styles from '../styles/CityUpdateFormStyles';

function CityUpdateForm({
  classes,
  // city data
  cities,
  countries,
  setCities,
  citiesGetURL,
  cityUpdateURL,
  // selected city update data
  selectedCity,
  setSelectedCity,
  selectedCityName,
  setSelectedCityName,
  selectedCityCountryName,
  setSelectedCityCountryName,
  // reset validation modes
  resetMode,
  setResetMode,
  cityResetMode,
  setCityResetMode,
  // show|hide udpdate form
  setShowCityTable,
  showCityUpdateForm,
  setShowCityUpdateForm,
  setRenderedData,
}) {
  const [cityAlreadyExist, setCityAlreadyExist] = useState(false);
  const validate = (values) => {
    const errors = {};
    if (!values.cityName && cityResetMode === false) {
      errors.cityName = 'City name is equired';
    }
    if (cityAlreadyExist) {
      errors.cityName = 'City already exist!';
    }
    if (!values.country && resetMode === false) {
      errors.country = 'Country is required';
    }
    return errors;
  };

  // main update function
  const updateCity = (values) => {
    const { cityName } = values;
    const [countryOfCity] = countries.filter(
      (c) => c.name === selectedCityCountryName
    );
    const { id, name } = countryOfCity;
    const newCity = {
      id: selectedCity.id,
      name: selectedCityName ? selectedCityName : cityName,
      countryId: id,
      country: {
        name,
        id,
      },
    };
    if (newCity.id && newCity.name && newCity.countryId) {
      // insert updated city
      updateData(
        citiesGetURL,
        setCities,
        cityUpdateURL + selectedCity.id,
        newCity
      );
      // set selected data and conds.
      setCityAlreadyExist(false);
      setSelectedCity({});
      // hide city update form - show its table
      setShowCityUpdateForm(false);
      setShowCityTable(true);
      setRenderedData('cities-rendered');
      console.log(newCity);
    }
  };

  const controlCityExist = (val) => {
    const sameCities = cities.filter(
      (city) => city.name.trim().toLowerCase() === val.trim().toLowerCase()
    );
    if (sameCities.length > 0) {
      setCityAlreadyExist(true);
    }
    setSelectedCityName(val);
  };

  const handleCountryClick = (country) => {
    setSelectedCityCountryName(country.name);
  };

  // reset valitions to show
  const handleCityClick = () => {
    setCityResetMode(false);
  };
  const handleCountriesSelect = () => {
    setResetMode(false);
  };

  const handleCancelButton = () => {
    // reset update data
    setCityAlreadyExist(false);
    setSelectedCity({});
    // show supplier table
    setShowCityUpdateForm(false);
    setShowCityTable(true);
    setRenderedData('cities-rendered');
  };

  const getCountriesMenu = () => {
    return countries.map((country) => (
      <MenuItem
        key={country.id}
        value={country.name}
        onClick={() => handleCountryClick(country)}
      >
        {country.name}
      </MenuItem>
    ));
  };

  return (
    <div
      style={{ padding: 16, margin: 'auto', maxWidth: 600 }}
      className={showCityUpdateForm ? classes.Show : classes.Hide}
    >
      <div>
        <Form
          onSubmit={(data) => updateCity(data)}
          validate={validate}
          render={({ form, handleSubmit, submitting }) => (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={classes.CityUpdateForm}
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
                    City Update Form
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
                      label={cityResetMode ? selectedCityName : 'City name'}
                      onClick={() => handleCityClick()}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.SelectCountry}>
                    <Field
                      fullWidth
                      name='country'
                      component={Select}
                      label={
                        resetMode ? selectedCityCountryName : 'Select a Country'
                      }
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
                      className={classes.FormButtons}
                      variant='contained'
                      type='submit'
                      onClick={() => {
                        setResetMode(false);
                        !showCityUpdateForm && form.reset();
                        setTimeout(() => {
                          form.reset();
                        }, 1000);
                      }}
                      disabled={submitting}
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

export default withStyles(styles)(CityUpdateForm);
