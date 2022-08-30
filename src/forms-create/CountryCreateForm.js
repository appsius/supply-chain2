import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { Paper, Grid, Button, withStyles } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { createData } from '../helpers';
import styles from '../styles/CountryCreateFormStyles';

function CountryCreateForm({
  classes,
  // country data
  countries,
  countriesGetURL,
  setCountries,
  countryCreateURL,
  // reset validation mode
  resetMode,
  setResetMode,
  // show|hide create form or table
  setShowCountryTable,
  showCountryCreateForm,
  setShowCountryCreateForm,
  setRenderedData,
}) {
  const validate = (values) => {
    const errors = {};
    if (!values.country && resetMode === false) {
      errors.country = 'Country name is required';
    }
    if (countryAlreadyExist.length > 0) {
      errors.country = 'Country already exist';
    }
    return errors;
  };
  const [countryAlreadyExist, setCountryAlreadyExist] = useState([]);

  // main create function - onSubmit form
  const createNewCountry = async (values) => {
    const id = uuidv4();
    const newCountry = {
      id,
      name: values.country,
    };
    if (values.country) {
      // insert country data
      createData(countriesGetURL, setCountries, countryCreateURL, newCountry);
      // reset to initial values
      setCountryAlreadyExist([]);
      // hide country form, show table
      setShowCountryCreateForm(false);
      setShowCountryTable(true);
      setRenderedData('countries-rendered');
      console.log(newCountry);
    }
  };

  const controlCountryExist = (val) => {
    const sameCountries = countries.filter(
      (country) =>
        country.name.trim().toLowerCase() === val.trim().toLowerCase()
    );
    setResetMode(false);
    setCountryAlreadyExist(sameCountries);
  };

  const handleCancelButton = () => {
    // reset update data
    setCountryAlreadyExist([]);
    // show supplier table
    setShowCountryCreateForm(false);
    setShowCountryTable(true);
    setRenderedData('countries-rendered');
  };

  return (
    <div
      style={{ padding: 16, margin: 'auto', maxWidth: 600 }}
      className={showCountryCreateForm ? classes.Show : classes.Hide}
    >
      <div>
        <Form
          onSubmit={(data) => createNewCountry(data)}
          validate={validate}
          render={({ form, handleSubmit, submitting }) => (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={classes.CountryCreateForm}
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
                    Country Create Form
                  </h2>
                  <Grid
                    item
                    xs={12}
                    onChange={(e) => controlCountryExist(e.target.value)}
                  >
                    <Field
                      fullWidth
                      name='country'
                      component={TextField}
                      label='Country name'
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
                      disabled={submitting || countryAlreadyExist.length > 0}
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

export default withStyles(styles)(CountryCreateForm);
