import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { TextField, Select } from 'final-form-material-ui';
import { Paper, Grid, Button, MenuItem, withStyles } from '@material-ui/core';
import { updateData } from '../helpers';
import styles from '../styles/SupplierUpdateFormStyles';

function SupplierUpdateForm({
  classes,
  // supplier data
  cities,
  countries,
  supplierTypes,
  suppliersGetURL,
  setSuppliers,
  supplierUpdateURL,
  // selected supplier update data
  selectedUpdateSupplier,
  setSelectedUpdateSupplier,
  updateSupplierCode,
  setUpdateSupplierCode,
  updatedSupplierName,
  setUpdatedSupplierName,
  updatedSupplierDName,
  setUpdatedSupplierDName,
  updatedSupplierAddress,
  setUpdatedSupplierAddress,
  updatedSupplierCity,
  setUpdatedSupplierCity,
  updatedSupplierCountry,
  setUpdatedSupplierCountry,
  updatedSupplierSType,
  setUpdatedSupplierSType,
  // reset validation modes
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
  // show|hide udpdate form
  setShowSupplierTable,
  showSupplierUpdateForm,
  setShowSupplierUpdateForm,
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
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState({});
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedSupplierType, setSelectedSupplierType] = useState({});

  const updateSupplier = async (values) => {
    const { code, name, displayName, address } = values;
    let updatedSupplier = {
      id: selectedUpdateSupplier.id,
      code: code ? code : selectedUpdateSupplier.code,
      name: name ? name : selectedUpdateSupplier.name,
      displayName: displayName
        ? displayName
        : selectedUpdateSupplier.displayName,
      address: address ? address : selectedUpdateSupplier.address,
      cityId: selectedCity.id ? selectedCity.id : updatedSupplierCity.id,
      countryId: selectedCountry.id
        ? selectedCountry.id
        : updatedSupplierCountry.id,
      supplierTypeId: selectedSupplierType.id
        ? selectedSupplierType.id
        : updatedSupplierSType.id,
    };
    if (
      updatedSupplier.code &&
      updatedSupplier.name &&
      updatedSupplier.displayName &&
      updatedSupplier.address &&
      updatedSupplier.cityId &&
      updatedSupplier.countryId &&
      updatedSupplier.supplierTypeId
    ) {
      // insert updated supplier
      updateData(
        suppliersGetURL,
        setSuppliers,
        supplierUpdateURL + selectedUpdateSupplier.id,
        updatedSupplier
      );
      // reset selected data
      setUpdatedSupplierCity({});
      setUpdatedSupplierCountry({});
      setUpdatedSupplierSType({});
      setSelectedUpdateSupplier({});
      setSelectedCities([]);
      setSelectedCity({});
      setSelectedCountry({});
      setSelectedSupplierType({});
      // hide supplier update form, show its table
      setShowSupplierUpdateForm(false);
      setShowSupplierTable(true);
      setRenderedData('suppliers-rendered');
      console.log(updatedSupplier);
    }
  };

  const handleCitySelected = (city) => {
    const countryOfCity = countries.filter((c) => c.id === city.countryId);
    setUpdatedSupplierCountry({});
    setSelectedCountry(countryOfCity[0]);
    setSelectedCity(city);
  };

  const handleCountrySelected = (country) => {
    const citiesOfCountry = cities.filter(
      (city) => city.countryId === country.id
    );
    setUpdatedSupplierCity({});
    setSelectedCities(citiesOfCountry);
    setSelectedCountry(country);
  };

  const handleSupplierTypeSelected = (supplierType) => {
    setSelectedSupplierType(supplierType);
  };

  const getCitiesMenu = () => {
    if (selectedCities.length > 0) {
      const renderedCities = selectedCities.map((sCity) => {
        const { id, name } = sCity;
        return (
          <MenuItem
            key={id}
            value={name}
            onClick={() => handleCitySelected(sCity)}
          >
            {name}
          </MenuItem>
        );
      });
      return renderedCities;
    } else {
      const renderedCities = cities.map((city) => {
        const { id, name, country } = city;
        if (!country) return false;
        return (
          <MenuItem
            key={id}
            value={name}
            onClick={() => handleCitySelected(city)}
          >
            {name}
          </MenuItem>
        );
      });
      return renderedCities;
    }
  };

  const getCountriesMenu = () => {
    const { id, name } = selectedCountry;
    if (name) {
      return (
        <MenuItem
          key={id}
          value={name}
          onClick={() => handleCountrySelected(selectedCountry)}
        >
          {name}
        </MenuItem>
      );
    } else {
      return countries.map((country) => {
        const countryHasCities =
          cities.filter((c) => c.countryId === country.id).length > 0;
        if (!countryHasCities) return false;
        const { id, name } = country;
        return (
          <MenuItem
            key={id}
            value={name}
            onClick={() => handleCountrySelected(country)}
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
          onClick={() => handleSupplierTypeSelected(supplierType)}
        >
          {name}
        </MenuItem>
      );
    });
  };

  // resetting validation for supplier after submit
  const handleCodeResetMode = () => {
    setUpdateSupplierCode('');
    setResetCodeMode(false);
  };
  const handleNameResetMode = () => {
    setUpdatedSupplierName('');
    setResetNameMode(false);
  };
  const handleDisplayNameResetMode = () => {
    setUpdatedSupplierDName('');
    setResetDNameMode(false);
  };
  const handleAdressResetMode = () => {
    setUpdatedSupplierAddress('');
    setResetAddressMode(false);
  };
  const handleCityResetMode = () => {
    setUpdatedSupplierCity({});
    setResetCityMode(false);
    setResetCountryMode(false);
  };
  const handleCountryResetMode = () => {
    setUpdatedSupplierCountry({});
    setResetCountryMode(false);
    setResetCityMode(false);
  };
  const handleSupplierTypeResetMode = () => {
    setUpdatedSupplierSType({});
    setResetSTypeMode(false);
  };

  const handleCancelButton = () => {
    // reset selected data
    setUpdatedSupplierCity({});
    setUpdatedSupplierCountry({});
    setUpdatedSupplierSType({});
    setSelectedUpdateSupplier({});
    setSelectedCities([]);
    setSelectedCity({});
    setSelectedCountry({});
    setSelectedSupplierType({});
    // hide ssupplier update form, show its table
    setShowSupplierUpdateForm(false);
    setShowSupplierTable(true);
    setRenderedData('suppliers-rendered');
  };

  return (
    <div
      style={{ padding: '16px', margin: 'auto', maxWidth: 7500 }}
      className={showSupplierUpdateForm ? classes.Show : classes.Hide}
    >
      {/* <div className={classes.CreateForm}> */}
      <div className={classes.SupplierUpdateForm + ' ' + classes.CreateForm}>
        <Form
          onSubmit={(data) => updateSupplier(data)}
          validate={validate}
          render={({ form, handleSubmit, submitting }) => (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={classes.SupplierUpdateForm}
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
                      Supplier Update Form
                    </h2>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='code'
                      component={TextField}
                      label={
                        updateSupplierCode
                          ? updateSupplierCode
                          : 'Supplier code'
                      }
                      onClick={() => handleCodeResetMode()}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='name'
                      component={TextField}
                      label={
                        updatedSupplierName
                          ? updatedSupplierName
                          : 'Supplier Name'
                      }
                      onClick={() => handleNameResetMode()}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='displayName'
                      component={TextField}
                      label={
                        updatedSupplierDName
                          ? updatedSupplierDName
                          : 'Display Name'
                      }
                      onClick={() => handleDisplayNameResetMode()}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='address'
                      component={TextField}
                      label={
                        updatedSupplierAddress
                          ? updatedSupplierAddress
                          : 'Address'
                      }
                      onClick={() => handleAdressResetMode()}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name='selectedCityName'
                      component={Select}
                      formControlProps={{ fullWidth: true }}
                      label={
                        updatedSupplierCity.name
                          ? updatedSupplierCity.name
                          : 'Select a city'
                      }
                      onClick={() => handleCityResetMode()}
                    >
                      {getCitiesMenu()}
                    </Field>
                  </Grid>
                  <Grid item xs={6} className={classes.SelectCountry}>
                    <Field
                      fullWidth
                      defaultValue=''
                      name='selectedCountryName'
                      component={Select}
                      formControlProps={{ fullWidth: true }}
                      label={
                        updatedSupplierCountry.name
                          ? updatedSupplierCountry.name
                          : 'Select a Country'
                      }
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
                      formControlProps={{ fullWidth: true }}
                      label={
                        updatedSupplierSType.name
                          ? updatedSupplierSType.name
                          : 'Select a Supplier Type'
                      }
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
                        setTimeout(() => {
                          form.reset();
                        }, 1000);
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

export default withStyles(styles)(SupplierUpdateForm);
