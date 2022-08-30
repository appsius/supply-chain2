import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { getData } from './helpers';
import SuppliersTable from './tables/SuppliersTable';
import CountriesTable from './tables/CountriesTable';
import CitiesTable from './tables/CitiesTable';
import { withStyles } from '@material-ui/core';
import styles from './styles/SidebarStyles';

function SideBar({ classes }) {
  // if no data cond.
  const noDataText = 'Click dashboard to see Suppliers, Countries & Cities';
  const [loading, setLoading] = useState(false);
  // get data URLs
  // const suppliersGetURL =
  //   'http://45.130.15.52:6501/api/services/app/Supplier/GetAll';
  // const countriesGetURL =
  //   'http://45.130.15.52:6501/api/services/app/Country/GetAll';
  // const citiesGetURL = 'http://45.130.15.52:6501/api/services/app/City/GetAll';

  // get data URLs - JSON_SERVER
  const suppliersGetURL = '/suppliers';
  const countriesGetURL = '/countries';
  const citiesGetURL = '/cities';
  const supplierTypesGetURL = '/supplierTypes';
  // data to fetch
  const [suppliers, setSuppliers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [supplierTypes, setSupplierTypes] = useState([]);
  // hide forms and table
  const [showSupplierCreateForm, setShowSupplierCreateForm] = useState(false);
  const [showSupplierUpdateForm, setShowSupplierUpdateForm] = useState(false);
  const [showCountryCreateForm, setShowCountryCreateForm] = useState(false);
  const [showCountryUpdateForm, setShowCountryUpdateForm] = useState(false);
  const [showCityCreateForm, setShowCityCreateForm] = useState(false);
  const [showCityUpdateForm, setShowCityUpdateForm] = useState(false);
  const [showSupplierTable, setShowSupplierTable] = useState(false);
  const [showCountryTable, setShowCountryTable] = useState(false);
  const [showCityTable, setShowCityTable] = useState(false);
  const [renderedData, setRenderedData] = useState('');

  useEffect(() => {
    getData(suppliersGetURL, setSuppliers);
    getData(countriesGetURL, setCountries);
    getData(citiesGetURL, setCities);
    getData(supplierTypesGetURL, setSupplierTypes);
  }, []);

  function hideAllForms() {
    setShowSupplierCreateForm(false);
    setShowSupplierUpdateForm(false);
    setShowCountryCreateForm(false);
    setShowCountryUpdateForm(false);
    setShowCityCreateForm(false);
    setShowCityUpdateForm(false);
  }

  // fetch data function
  function handleClick(dataUrl, setData, popupState, renderedData) {
    popupState.close();
    setLoading(true);
    getData(dataUrl, setData);
    hideAllForms();
    if (renderedData === 'suppliers-rendered') {
      setShowSupplierTable(true);
      setRenderedData('suppliers-rendered');
    } else if (renderedData === 'countries-rendered') {
      setShowCountryTable(true);
      setRenderedData('countries-rendered');
    } else if (renderedData === 'cities-rendered') {
      setShowCityTable(true);
      setRenderedData('cities-rendered');
    }
  }

  return (
    <div className={classes.Content}>
      <div className={classes.Sidebar}>
        <div className={classes.Menu}>
          <PopupState variant='popover' popupId='demo-popup-menu'>
            {(popupState) => (
              <React.Fragment style={{ width: '13vw' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant='contained'
                    {...bindTrigger(popupState)}
                    style={{
                      backgroundColor: 'black',
                      textTransform: 'uppercase',
                      minWidth: '64px',
                      padding: '6px 16px',
                      borderRadius: '4px',
                    }}
                  >
                    Dashboard
                  </Button>
                  <Menu
                    {...bindMenu(popupState)}
                    className={classes.MenuList}
                    style={{ width: '12vw' }}
                  >
                    <MenuItem
                      className={
                        renderedData === 'suppliers-rendered'
                          ? `${classes.MenuListItemRendered} ${classes.MenuListItem}`
                          : `${classes.MenuListItem}`
                      }
                      onClick={() =>
                        handleClick(
                          suppliersGetURL,
                          setSuppliers,
                          popupState,
                          'suppliers-rendered'
                        )
                      }
                    >
                      Suppliers
                    </MenuItem>
                    <MenuItem
                      className={
                        renderedData === 'countries-rendered'
                          ? `${classes.MenuListItemRendered} ${classes.MenuListItem}`
                          : `${classes.MenuListItem}`
                      }
                      onClick={() =>
                        handleClick(
                          countriesGetURL,
                          setCountries,
                          popupState,
                          'countries-rendered'
                        )
                      }
                    >
                      Countries
                    </MenuItem>
                    <MenuItem
                      className={
                        renderedData === 'cities-rendered'
                          ? `${classes.MenuListItemRendered} ${classes.MenuListItem}`
                          : `${classes.MenuListItem}`
                      }
                      onClick={() =>
                        handleClick(
                          citiesGetURL,
                          setCities,
                          popupState,
                          'cities-rendered'
                        )
                      }
                    >
                      Cities
                    </MenuItem>
                  </Menu>
                </div>
              </React.Fragment>
            )}
          </PopupState>
        </div>
        <div className={classes.Table}>
          {!loading && <div className={classes.NoDataText}>{noDataText}</div>}
          {suppliers && renderedData === 'suppliers-rendered' && (
            <div>
              <div className={classes.Tables}>
                <SuppliersTable
                  // suppliers data
                  suppliers={suppliers}
                  countries={countries}
                  cities={cities}
                  supplierTypes={supplierTypes}
                  suppliersGetURL={suppliersGetURL}
                  setSuppliers={setSuppliers}
                  countriesGetURL={countriesGetURL}
                  setCountries={setCountries}
                  citiesGetURL={citiesGetURL}
                  setCities={setCities}
                  // show/hide supplier forms and table
                  showSupplierTable={showSupplierTable}
                  setShowSupplierTable={setShowSupplierTable}
                  showSupplierCreateForm={showSupplierCreateForm}
                  setShowSupplierCreateForm={setShowSupplierCreateForm}
                  showSupplierUpdateForm={showSupplierUpdateForm}
                  setShowSupplierUpdateForm={setShowSupplierUpdateForm}
                  setRenderedData={setRenderedData}
                />
              </div>
            </div>
          )}
          {countries && renderedData === 'countries-rendered' && (
            <div>
              <div className={classes.Tables}>
                <CountriesTable
                  // countries data
                  cities={cities}
                  countries={countries}
                  countriesGetURL={countriesGetURL}
                  setCountries={setCountries}
                  // show/hide country forms and table
                  showCountryTable={showCountryTable}
                  setShowCountryTable={setShowCountryTable}
                  showCountryCreateForm={showCountryCreateForm}
                  setShowCountryCreateForm={setShowCountryCreateForm}
                  showCountryUpdateForm={showCountryUpdateForm}
                  setShowCountryUpdateForm={setShowCountryUpdateForm}
                  setRenderedData={setRenderedData}
                />
              </div>
            </div>
          )}
          {cities && renderedData === 'cities-rendered' && (
            <div>
              <div className={classes.Tables}>
                <CitiesTable
                  // cities data
                  cities={cities}
                  countries={countries}
                  suppliers={suppliers}
                  citiesGetURL={citiesGetURL}
                  setCities={setCities}
                  countriesGetURL={countriesGetURL}
                  setCountries={setCountries}
                  // show/hide city forms and table
                  showCityTable={showCityTable}
                  setShowCityTable={setShowCityTable}
                  showCityCreateForm={showCityCreateForm}
                  setShowCityCreateForm={setShowCityCreateForm}
                  showCityUpdateForm={showCityUpdateForm}
                  setShowCityUpdateForm={setShowCityUpdateForm}
                  setRenderedData={setRenderedData}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(SideBar);
