import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { TextField, Select } from 'final-form-material-ui';
import { Paper, Grid, Button, MenuItem, withStyles } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { createData } from '../helpers';
import styles from '../styles/SupplierCreateFormStyles';

function SupplierCreateForm({
  classes,
  // supplier data
  countries,
  cities,
  suppliersGetURL,
  setSuppliers,
  supplierCreateURL,
  // validation reset modes
  resetCodeMode,
  resetNameMode,
  resetDNameMode,
  resetAddressMode,
  resetCityMode,
  resetCountryMode,
  resetSTypeMode,
  setResetCodeMode,
  setResetNameMode,
  setResetDNameMode,
  setResetAddressMode,
  setResetCityMode,
  setResetCountryMode,
  setResetSTypeMode,
  // show|hide form & table
  setShowSupplierTable,
  showSupplierCreateForm,
  setShowSupplierCreateForm,
  setRenderedData,
}) {
  const validate = (values) => {
    const errors = {};
    if (!values.code && resetCodeMode === false) {
      errors.code = 'Supplier code is required';
    }
    if (!values.name && resetNameMode === false) {
      errors.name = 'Name is required';
    }
    if (!values.displayName && resetDNameMode === false) {
      errors.displayName = 'Display name is required';
    }
    if (!values.address && resetAddressMode === false) {
      errors.address = 'Address is required';
    }
    if (!values.selectedCityName && resetCityMode === false) {
      errors.selectedCityName = 'City is required';
    }
    if (!values.selectedCountryName && resetCountryMode === false) {
      errors.selectedCountryName = 'Country is required';
    }
    if (!values.selectedSupplierTypeName && resetSTypeMode === false) {
      errors.selectedSupplierTypeName = 'Supplier type is required';
    }
    return errors;
  };
  const [supplierTypes, setSupplierTypes] = useState([]);
  const [selectedCity, setSelectedCity] = useState({});
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedSupplierType, setSelectedSupplierType] = useState({});
  const [selectedCities, setSelectedCities] = useState([]);

  useEffect(() => {
    fetch('http://45.130.15.52:6501/api/services/app/SupplierType/GetAll')
      .then((res) => res.json())
      .then(({ result }) => setSupplierTypes(result.items));
  }, []);

  // main supplier insertion function - onSubmit form
  const createNewSupplier = async (values) => {
    const { code, name, displayName, address } = values;
    const id = uuidv4();
    const newSupplier = {
      id,
      code,
      name,
      displayName,
      address,
      cityId: selectedCity.id,
      countryId: selectedCountry.id,
      supplierTypeId: selectedSupplierType.id,
      supplierType: {
        name: selectedSupplierType.name,
      },
    };

    if (
      code &&
      name &&
      displayName &&
      address &&
      selectedCity.id &&
      selectedCountry.id &&
      selectedSupplierType.id
    ) {
      // insert new supplier
      createData(suppliersGetURL, setSuppliers, supplierCreateURL, newSupplier);
      // reset selected data
      setSelectedCountry({});
      setSelectedCities([]);
      setSelectedSupplierType({});
      // show supplier table
      setShowSupplierCreateForm(false);
      setShowSupplierTable(true);
      setRenderedData('suppliers-rendered');
      console.log(newSupplier);
    }
  };

  const handleCitySelected = (country, city) => {
    let countryOfCity = [];
    if (country) {
      [countryOfCity] = countries.filter((c) => c.id === country.id);
    }
    setSelectedCountry(countryOfCity);
    setSelectedCity(city);
  };

  const handleCountrySelected = (countryID) => {
    const citiesOfCountry = cities.filter(
      (city) => city.countryId === countryID
    );
    setSelectedCities(citiesOfCountry);
  };

  const handleSupplierTypeSelected = (supplierTypeID) => {
    const [filteredSupplierType] = supplierTypes.filter(
      (sType) => sType.id === supplierTypeID
    );
    setSelectedSupplierType(filteredSupplierType);
  };

  // resetting validations conds. if false --> validate()
  const handleCodeResetMode = () => {
    setResetCodeMode(false);
  };
  const handleNameResetMode = () => {
    setResetNameMode(false);
  };
  const handleDisplayNameResetMode = () => {
    setResetDNameMode(false);
  };
  const handleAdressResetMode = () => {
    setResetAddressMode(false);
  };
  const handleCityResetMode = () => {
    setResetCityMode(false);
    setResetCountryMode(false);
  };
  const handleCountryResetMode = () => {
    setResetCountryMode(false);
    setResetCityMode(false);
  };
  const handleSupplierTypeResetMode = () => {
    setResetSTypeMode(false);
  };

  const handleCancelButton = () => {
    // reset selected data
    setSelectedCity({});
    setSelectedCountry({});
    setSelectedCities([]);
    setSelectedSupplierType({});
    // hide supplier form, show its table
    setShowSupplierCreateForm(false);
    setShowSupplierTable(true);
    setRenderedData('suppliers-rendered');
  };

  const getCitiesMenu = () => {
    // render only selected country's cities
    if (selectedCities.length > 0) {
      return selectedCities.map((sCity) => {
        const { id, name, country } = sCity;
        return (
          <MenuItem
            key={id}
            value={name}
            onClick={() => handleCitySelected(country, sCity)}
          >
            {name}
          </MenuItem>
        );
      });
    } else {
      // render all cities
      return cities.map((city) => {
        const { id, name, country } = city;
        return (
          <MenuItem
            key={id}
            value={name}
            onClick={() => handleCitySelected(country, city)}
          >
            {name}
          </MenuItem>
        );
      });
    }
  };

  const getCountriesMenu = () => {
    // render only selected city's country
    const { id, name } = selectedCountry;
    if (name) {
      return (
        <MenuItem
          key={id}
          value={name}
          onClick={() => handleCountrySelected(id)}
        >
          {name}
        </MenuItem>
      );
    } else {
      // render all countries if has city/cities
      return countries.map((country) => {
        const countryHasCities =
          cities.filter((c) => c.countryId === country.id).length > 0;
        if (!countryHasCities) return false;
        const { id, name } = country;
        return (
          <MenuItem
            key={id}
            value={name}
            onClick={() => handleCountrySelected(id)}
          >
            {name}
          </MenuItem>
        );
      });
    }
  };

  const getSupplierTypesMenu = () => {
    return supplierTypes.map((supplierType) => {
      const { id, name } = supplierType;
      return (
        <MenuItem
          key={id}
          value={name}
          onClick={() => handleSupplierTypeSelected(id)}
        >
          {name}
        </MenuItem>
      );
    });
  };

  return (
    <div
      style={{ padding: '16px', margin: 'auto' }}
      className={showSupplierCreateForm ? classes.Show : classes.Hide}
    >
      <div className={classes.CreateForm}>
        <Form
          onSubmit={(data) => createNewSupplier(data)}
          validate={validate}
          render={({ form, handleSubmit, submitting, pristine, values }) => (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={classes.SupplierCreateForm}
            >
              <Paper style={{ padding: '16px 16px 44px 16px' }}>
                <Grid container alignItems='flex-start' spacing={8}>
                  <Grid item xs={12} className={classes.SupplierFormTitle}>
                    <h2
                      style={{
                        marginLeft: '-55%',
                        fontWeight: '300',
                      }}
                    >
                      Supplier Create Form
                    </h2>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='code'
                      component={TextField}
                      label='Supplier code'
                      onClick={() => handleCodeResetMode()}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='name'
                      component={TextField}
                      label='Supplier Name'
                      onClick={() => handleNameResetMode()}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='displayName'
                      component={TextField}
                      label='Display Name'
                      onClick={() => handleDisplayNameResetMode()}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='address'
                      component={TextField}
                      label='Address'
                      onClick={() => handleAdressResetMode()}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='selectedCityName'
                      component={Select}
                      label='Select a City'
                      formControlProps={{ fullWidth: true }}
                      onClick={() => handleCityResetMode()}
                    >
                      {getCitiesMenu()}
                    </Field>
                  </Grid>
                  <Grid item xs={6} className={classes.SelectCountry}>
                    <Field
                      fullWidth
                      name='selectedCountryName'
                      component={Select}
                      label='Select a Country'
                      formControlProps={{ fullWidth: true }}
                      onClick={() => handleCountryResetMode()}
                    >
                      {getCountriesMenu()}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      fullWidth
                      name='selectedSupplierTypeName'
                      component={Select}
                      label='Select Supplier Type'
                      formControlProps={{ fullWidth: true }}
                      onClick={() => handleSupplierTypeResetMode()}
                    >
                      {getSupplierTypesMenu()}
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
                        classes.FormButtons + ' ' + classes.SupplierCancelButton
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

export default withStyles(styles)(SupplierCreateForm);
