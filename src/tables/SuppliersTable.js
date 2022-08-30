import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import { deleteData } from '../helpers';
import SupplierCreateForm from '../forms-create/SupplierCreateForm';
import SupplierUpdateForm from '../forms-update/SupplierUpdateForm';
import { withStyles } from '@material-ui/core';
import styles from '../styles/SuppliersTableStyles';

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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function SuppliersTable({
  classes,
  // suppliers data
  suppliers,
  countries,
  cities,
  supplierTypes,
  suppliersGetURL,
  setSuppliers,
  // show/hide form or table
  showSupplierTable,
  setShowSupplierTable,
  showSupplierCreateForm,
  setShowSupplierCreateForm,
  showSupplierUpdateForm,
  setShowSupplierUpdateForm,
  setRenderedData,
}) {
  // supplier post/update/delete URLs
  // const supplierCreateURL =
  //   'http://45.130.15.52:6501/api/services/app/Supplier/Create';
  // const supplierUpdateURL =
  //   'http://45.130.15.52:6501/api/services/app/Supplier/Update';
  // const supplierDeleteURL =
  //   'http://45.130.15.52:6501/api/services/app/Supplier/Delete?Id=';

  // json-server delete urls
  const supplierCreateURL = '/suppliers';
  const supplierUpdateURL = '/suppliers/';
  const supplierDeleteURL = '/suppliers/';
  // selected supplier update data
  const [selectedUpdateSupplier, setSelectedUpdateSupplier] = useState({});
  const [updateSupplierCode, setUpdateSupplierCode] = useState('');
  const [updatedSupplierName, setUpdatedSupplierName] = useState('');
  const [updatedSupplierDName, setUpdatedSupplierDName] = useState('');
  const [updatedSupplierAddress, setUpdatedSupplierAddress] = useState('');
  const [updatedSupplierCity, setUpdatedSupplierCity] = useState({});
  const [updatedSupplierCountry, setUpdatedSupplierCountry] = useState({});
  const [updatedSupplierSType, setUpdatedSupplierSType] = useState({});
  // validation reset controllers
  const [resetCodeMode, setResetCodeMode] = useState(false);
  const [resetNameMode, setResetNameMode] = useState(false);
  const [resetDNameMode, setResetDNameMode] = useState(false);
  const [resetAddressMode, setResetAddressMode] = useState(false);
  const [resetCityMode, setResetCityMode] = useState(false);
  const [resetCountryMode, setResetCountryMode] = useState(false);
  const [resetSTypeMode, setResetSTypeMode] = useState(false);
  // ıf no country & city
  const [alertNoCountryExist, setAlertNoCountryExist] = useState(false);
  const [alertNoCityExist, setAlertNoCityExist] = useState(false);

  const openSupplierForm = () => {
    // alert if no country exist
    if (countries.length < 1 && cities.length > 0) {
      setAlertNoCountryExist(true);
      setAlertNoCityExist(false);
      setShowSupplierCreateForm(false);
      setShowSupplierUpdateForm(false);
      setTimeout(() => {
        setAlertNoCountryExist(false);
      }, 3000);
    }
    // alert if no city exist
    else if (cities.length < 1 && countries.length > 0) {
      setAlertNoCityExist(true);
      setAlertNoCountryExist(false);
      setShowSupplierCreateForm(false);
      setShowSupplierUpdateForm(false);
      setTimeout(() => {
        setAlertNoCityExist(false);
      }, 3000);
    }
    // alert if no city exist
    else if (countries.length < 1 && cities.length < 1) {
      setAlertNoCityExist(true);
      setAlertNoCountryExist(true);
      setShowSupplierCreateForm(false);
      setShowSupplierUpdateForm(false);
      setTimeout(() => {
        setAlertNoCityExist(false);
        setAlertNoCountryExist(false);
      }, 3000);
    } else {
      // set validation modes
      // not show validation errors when open create form
      setResetCodeMode(true);
      setResetNameMode(true);
      setResetDNameMode(true);
      setResetAddressMode(true);
      setResetCityMode(true);
      setResetCountryMode(true);
      setResetSTypeMode(true);
      // hide table and show create form
      setShowSupplierCreateForm(true);
      setShowSupplierTable(false);
      setShowSupplierUpdateForm(false);
    }
  };

  function handleSupplierUpdate(supplier) {
    // get selected data - city, country, s.type
    const selectedCity = cities.filter((city) => city.id === supplier.cityId);
    const selectedCountry = countries.filter(
      (country) => country.id === supplier.countryId
    );
    const selectedSType = supplierTypes.filter(
      (sType) => sType.id === supplier.supplierTypeId
    );
    // set selected supplier update data
    setSelectedUpdateSupplier(supplier);
    setUpdateSupplierCode(supplier.code);
    setUpdatedSupplierName(supplier.name);
    setUpdatedSupplierDName(supplier.displayName);
    setUpdatedSupplierAddress(supplier.address);
    setUpdatedSupplierCity(selectedCity[0]);
    setUpdatedSupplierCountry(selectedCountry[0]);
    setUpdatedSupplierSType(selectedSType[0]);
    // set validation modes
    // not show validation errors when open update form
    setResetCodeMode(true);
    setResetNameMode(true);
    setResetDNameMode(true);
    setResetAddressMode(true);
    setResetCityMode(true);
    setResetCountryMode(true);
    setResetSTypeMode(true);
    // hide table and show update form
    setShowSupplierTable(false);
    setShowSupplierCreateForm(false);
    setShowSupplierUpdateForm(true);
  }

  const handleSupplierDelete = (id) => {
    deleteData(suppliersGetURL, setSuppliers, supplierDeleteURL + id);
    setShowSupplierTable(true);
    setRenderedData('suppliers-rendered');
  };

  return (
    <div>
      {(alertNoCityExist || alertNoCountryExist) && (
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
          {(alertNoCountryExist &&
            `No country existed, please add a country first!`) ||
            (alertNoCityExist && `No city existed, please add a city first!`) ||
            (alertNoCountryExist &&
              `Neither country nor city existed, please add a city & a country first!`)}
        </Alert>
      )}
      <TableContainer
        component={Paper}
        className={showSupplierTable ? classes.Show : classes.Hide}
      >
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>ID</StyledTableCell>
              <StyledTableCell align='center'>Code</StyledTableCell>
              <StyledTableCell align='center'>Name</StyledTableCell>
              <StyledTableCell align='center'>Display Name</StyledTableCell>
              <StyledTableCell align='center'>Address</StyledTableCell>
              <StyledTableCell align='center'>City</StyledTableCell>
              <StyledTableCell align='center'>Country</StyledTableCell>
              <StyledTableCell align='center'>Supplier Type</StyledTableCell>
              <StyledTableCell
                align='right'
                className={classes.SupplierTableButtons}
              >
                <Button
                  className={classes.Button + ' ' + classes.InsertButton}
                  variant='contained'
                  color='success'
                  onClick={() => openSupplierForm()}
                >
                  NEW SUPPLIER
                </Button>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier, sIdx) => {
              const [city] = cities.filter((c) => c.id === supplier.cityId);
              const [supplierType] = supplierTypes.filter(
                (sT) => sT.id === supplier.supplierTypeId
              );
              console.log(city, supplierType);

              const { id, code, name, displayName, address } = supplier;
              return (
                <StyledTableRow key={id}>
                  <StyledTableCell align='left'>{sIdx + 1}</StyledTableCell>
                  <StyledTableCell align='center'>{code}</StyledTableCell>
                  <StyledTableCell align='center'>{name}</StyledTableCell>
                  <StyledTableCell align='center'>
                    {displayName}
                  </StyledTableCell>
                  <StyledTableCell align='center'>{address}</StyledTableCell>
                  <StyledTableCell align='center'>{city.name}</StyledTableCell>
                  <StyledTableCell align='center'>
                    {city.country.name}
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    {supplierType.name}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    <Button
                      className={classes.Button + ' ' + classes.UpdateButton}
                      variant='contained'
                      onClick={() => handleSupplierUpdate(supplier)}
                    >
                      UPDATE
                    </Button>
                    <Button
                      className={classes.Button + ' ' + classes.DeleteButton}
                      variant='contained'
                      color='error'
                      id={id}
                      onClick={(e) => handleSupplierDelete(e.target.id)}
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
      {showSupplierCreateForm && (
        <SupplierCreateForm
          // suppliers data
          countries={countries}
          cities={cities}
          suppliersGetURL={suppliersGetURL}
          setSuppliers={setSuppliers}
          supplierCreateURL={supplierCreateURL}
          // validation reset modes
          resetCodeMode={resetCodeMode}
          resetNameMode={resetNameMode}
          resetDNameMode={resetDNameMode}
          resetAddressMode={resetAddressMode}
          resetCityMode={resetCityMode}
          resetCountryMode={resetCountryMode}
          resetSTypeMode={resetSTypeMode}
          setResetCodeMode={setResetCodeMode}
          setResetNameMode={setResetNameMode}
          setResetDNameMode={setResetDNameMode}
          setResetAddressMode={setResetAddressMode}
          setResetCityMode={setResetCityMode}
          setResetCountryMode={setResetCountryMode}
          setResetSTypeMode={setResetSTypeMode}
          // hide table, show supplier create form
          setShowSupplierTable={setShowSupplierTable}
          showSupplierCreateForm={showSupplierCreateForm}
          setShowSupplierCreateForm={setShowSupplierCreateForm}
          setRenderedData={setRenderedData}
        />
      )}
      {showSupplierUpdateForm && (
        <SupplierUpdateForm
          // suppliers data
          cities={cities}
          countries={countries}
          supplierTypes={supplierTypes}
          suppliersGetURL={suppliersGetURL}
          setSuppliers={setSuppliers}
          supplierUpdateURL={supplierUpdateURL}
          // selected supplier update data
          selectedUpdateSupplier={selectedUpdateSupplier}
          setSelectedUpdateSupplier={setSelectedUpdateSupplier}
          updateSupplierCode={updateSupplierCode}
          setUpdateSupplierCode={setUpdateSupplierCode}
          updatedSupplierName={updatedSupplierName}
          setUpdatedSupplierName={setUpdatedSupplierName}
          updatedSupplierDName={updatedSupplierDName}
          setUpdatedSupplierDName={setUpdatedSupplierDName}
          updatedSupplierAddress={updatedSupplierAddress}
          setUpdatedSupplierAddress={setUpdatedSupplierAddress}
          updatedSupplierCity={updatedSupplierCity}
          setUpdatedSupplierCity={setUpdatedSupplierCity}
          updatedSupplierCountry={updatedSupplierCountry}
          setUpdatedSupplierCountry={setUpdatedSupplierCountry}
          updatedSupplierSType={updatedSupplierSType}
          setUpdatedSupplierSType={setUpdatedSupplierSType}
          // validation reset modes
          resetCodeMode={resetCodeMode}
          resetNameMode={resetNameMode}
          resetDNameMode={resetDNameMode}
          resetAddressMode={resetAddressMode}
          resetCityMode={resetCityMode}
          resetCountryMode={resetCountryMode}
          resetSTypeMode={resetSTypeMode}
          setResetCodeMode={setResetCodeMode}
          setResetNameMode={setResetNameMode}
          setResetDNameMode={setResetDNameMode}
          setResetAddressMode={setResetAddressMode}
          setResetCityMode={setResetCityMode}
          setResetCountryMode={setResetCountryMode}
          setResetSTypeMode={setResetSTypeMode}
          // hide table, show supplier update form
          setShowSupplierTable={setShowSupplierTable}
          showSupplierUpdateForm={showSupplierUpdateForm}
          setShowSupplierUpdateForm={setShowSupplierUpdateForm}
          setRenderedData={setRenderedData}
        />
      )}
    </div>
  );
}
export default withStyles(styles)(SuppliersTable);
