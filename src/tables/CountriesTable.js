import React, { useState } from 'react';
import styled from '@mui/material/styles/styled';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { deleteData } from '../helpers';
import CountryUpdateForm from '../forms-update/CountryUpdateForm';
import CountryCreateForm from '../forms-create/CountryCreateForm';
import { Alert } from '@mui/material';
import { withStyles } from '@material-ui/core';
import styles from '../styles/CountriesTableStyles';

// table rows styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function CountriesTable({
  classes,
  // countries data
  cities,
  countries,
  countriesGetURL,
  setCountries,
  // show/hide table or forms
  showCountryTable,
  setShowCountryTable,
  showCountryCreateForm,
  setShowCountryCreateForm,
  showCountryUpdateForm,
  setShowCountryUpdateForm,
  setRenderedData,
}) {
  // country post/update/delete URLs
  // const countryCreateURL =
  //   'http://45.130.15.52:6501/api/services/app/Country/Create';
  // const countryUpdateURL =
  //   'http://45.130.15.52:6501/api/services/app/Country/Update';
  // const countryDeleteURL =
  //   'http://45.130.15.52:6501/api/services/app/Country/Delete?Id=';
  // country post/update/delete URLs
  // json-server delete urls
  const countryCreateURL = 'http://localhost:3000/countries';
  const countryUpdateURL = 'http://localhost:3000/countries/';
  const countryDeleteURL = 'http://localhost:3000/countries/';
  // selected country update data
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [alertCountryName, setAlertCountryName] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // validation reset controller
  const [resetMode, setResetMode] = useState(true);

  function handleShowCreateForm() {
    // set validation modes
    // not show validation error when open create form
    setResetMode(true);
    // hide table and show create form
    setShowCountryTable(false);
    setShowCountryUpdateForm(false);
    setShowCountryCreateForm(true);
  }

  function handleCountryUpdate(country) {
    // selected country data
    setSelectedCountry(country);
    setSelectedCountryName(country.name);
    setResetMode(true);
    // set validation modes
    // not show validation errors when open update form
    setResetMode(true);
    // hide table and show update form
    setShowCountryTable(false);
    setShowCountryCreateForm(false);
    setShowCountryUpdateForm(true);
  }

  function handleCountryDelete(country) {
    // Alert - do not delete country if has city
    const citiesOfCountry = cities.filter(
      (city) => city.countryId === country.id
    );
    if (citiesOfCountry.length > 0) {
      setAlertCountryName(country.name);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      deleteData(countriesGetURL, setCountries, countryDeleteURL + country.id);
      setShowCountryTable(true);
      setRenderedData('countries-rendered');
    }
  }

  return (
    <div>
      {showAlert && (
        <Alert
          variant='filled'
          severity='error'
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            top: '1.5vh',
            width: '88vw',
            height: '6vh',
            borderRadius: 0,
            backgroundColor: 'red',
            fontSize: '1rem',
            fontWeight: 'lighter',
            letterSpacing: '1.25px',
          }}
        >
          {`${alertCountryName}  has cities, update|delete them first!`}
        </Alert>
      )}
      <TableContainer
        component={Paper}
        className={showCountryTable ? classes.Show : classes.Hide}
      >
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>ID</StyledTableCell>
              <StyledTableCell align='center'>Name</StyledTableCell>
              <StyledTableCell
                align='right'
                className={classes.CountryTableButtons}
              >
                <Button
                  className={classes.Button + ' ' + classes.InsertButton}
                  variant='contained'
                  color='success'
                  onClick={() => handleShowCreateForm()}
                >
                  NEW COUNTRY
                </Button>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.map((country, cIdx) => {
              const { id, name } = country;
              return (
                <StyledTableRow key={id}>
                  <StyledTableCell align='left'>{cIdx + 1}</StyledTableCell>
                  <StyledTableCell align='center'>{name}</StyledTableCell>
                  <StyledTableCell align='right'>
                    <Button
                      className={classes.Button + ' ' + classes.UpdateButton}
                      variant='contained'
                      onClick={() => handleCountryUpdate(country)}
                    >
                      UPDATE
                    </Button>
                    <Button
                      className={classes.Button + ' ' + classes.DeleteButton}
                      variant='contained'
                      color='error'
                      id={id}
                      onClick={() => handleCountryDelete(country)}
                    >
                      DELETE
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <CountryCreateForm
        // countries data
        countries={countries}
        countriesGetURL={countriesGetURL}
        setCountries={setCountries}
        countryCreateURL={countryCreateURL}
        // validation reset modes
        resetMode={resetMode}
        setResetMode={setResetMode}
        // hide table, show country create form
        setShowCountryTable={setShowCountryTable}
        showCountryCreateForm={showCountryCreateForm}
        setShowCountryCreateForm={setShowCountryCreateForm}
        setRenderedData={setRenderedData}
      />
      <CountryUpdateForm
        // countries data
        countries={countries}
        countriesGetURL={countriesGetURL}
        setCountries={setCountries}
        countryUpdateURL={countryUpdateURL}
        // selected country data for filling labels
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedCountryName={selectedCountryName}
        setSelectedCountryName={setSelectedCountryName}
        // validation reset modes
        resetMode={resetMode}
        setResetMode={setResetMode}
        // hide table, show country update form
        setShowCountryTable={setShowCountryTable}
        showCountryUpdateForm={showCountryUpdateForm}
        setShowCountryUpdateForm={setShowCountryUpdateForm}
        setRenderedData={setRenderedData}
      />
    </div>
  );
}

export default withStyles(styles)(CountriesTable);
