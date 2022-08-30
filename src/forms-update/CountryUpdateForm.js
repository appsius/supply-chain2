import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { Paper, Grid, Button, withStyles } from '@material-ui/core';
import { updateData } from '../helpers';
import styles from '../styles/CountryUpdateFormStyles';

function CountryUpdateForm({
  classes,
  // country data
  countries,
  countriesGetURL,
  setCountries,
  countryUpdateURL,
  // selected country update data
  selectedCountry,
  setSelectedCountry,
  selectedCountryName,
  setSelectedCountryName,
  // reset validation mode
  resetMode,
  setResetMode,
  // show|hide udpdate form
  setShowCountryTable,
  showCountryUpdateForm,
  setShowCountryUpdateForm,
  setRenderedData,
}) {
  const validate = (values) => {
    const errors = {};
    if (!values.country && resetMode === false) {
      errors.country = 'Country name is required';
    }
    if (countryAlreadyExist.length > 0) {
      errors.country = 'Country already exist!';
    }
    return errors;
  };
  const [countryAlreadyExist, setCountryAlreadyExist] = useState([]);

  console.log(selectedCountry);

  // main update function
  const updateCountry = async (values) => {
    values.country === '' && (values.country = selectedCountry.name);

    const updatedCountry = {
      id: selectedCountry.id,
      name: values.country,
    };
    if (values.country) {
      // insert updated country
      updateData(
        countriesGetURL,
        setCountries,
        countryUpdateURL + selectedCountry.id,
        updatedCountry
      );
      // reset selected data and conds.
      setCountryAlreadyExist([]);
      setSelectedCountry({});
      // hide country update form - show its table
      setShowCountryUpdateForm(false);
      setShowCountryTable(true);
      setRenderedData('countries-rendered');
      console.log(updatedCountry);
    }
  };

  const controlUpdateCountryExist = (val) => {
    const sameCountries = countries.filter(
      (country) =>
        country.name !== '' &&
        country.name.trim().toLowerCase() === val.trim().toLowerCase()
    );
    setResetMode(false);
    setSelectedCountryName('');
    setCountryAlreadyExist(sameCountries);
  };

  const handleCancelButton = () => {
    // reset selected update data
    setCountryAlreadyExist([]);
    setSelectedCountry({});
    // show supplier table
    setShowCountryUpdateForm(false);
    setShowCountryTable(true);
    setRenderedData('countries-rendered');
  };

  return (
    <div
      style={{ padding: 16, margin: 'auto', maxWidth: 600 }}
      className={showCountryUpdateForm ? classes.Show : classes.Hide}
    >
      <div>
        <Form
          onSubmit={(data) => updateCountry(data)}
          validate={validate}
          render={({ form, handleSubmit, submitting }) => (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={classes.CountryUpdateForm}
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
                    Country Update Form
                  </h2>
                  <Grid
                    item
                    xs={12}
                    onChange={(e) => controlUpdateCountryExist(e.target.value)}
                  >
                    <Field
                      fullWidth
                      name='country'
                      component={TextField}
                      label={
                        selectedCountryName
                          ? selectedCountryName
                          : 'Country name'
                      }
                    />
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
                        classes.FormButtons + ' ' + classes.CountryFormButtons
                      }
                      type='submit'
                      variant='contained'
                      onClick={() => {
                        setResetMode(false);
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
export default withStyles(styles)(CountryUpdateForm);
