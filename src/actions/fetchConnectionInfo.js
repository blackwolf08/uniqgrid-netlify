import axios from 'axios';
import { SET_VID, DEVICE_POOL, OUTPUT_ARR } from './types';
import jwtDecode from 'jwt-decode';

export const fetchConnetionInfo = id => dispatch => {
  return new Promise((resolve, reject) => {
    //if its not the first connection
    if (id > 1) {
      if (typeof localStorage.jwtToken !== 'undefined') {
        let jwt = localStorage.jwtToken;
        jwt = jwtDecode(jwt);

        const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
          jwt.sub
        }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

        axios
          .get(URL)
          .then(res => {
            //get properties array
            const properties = res.data.properties;
            let pool;
            const vid = res.data.vid;
            let output = {};
            output[`gps_coordinate_site${id}_`] = { value: '' };
            output[`street_site${id}_`] = { value: '' };
            output[`city_site${id}_`] = { value: '' };
            output[`master_site${id}`] = { value: '' };
            output[`state_site_${id}_`] = { value: '' };
            output[`postal_code_site_${id}_`] = { value: '' };
            output[`electricity_connection_name_site_${id}_`] = { value: '' };
            output[`connected_load_kw_site_${id}_`] = { value: '' };
            output[`segment_site_${id}_`] = { value: '' };
            output[`sub_segment_site_${id}_`] = { value: '' };
            output[`average_monthly_energy_cost_site_${id}_`] = { value: '' };
            output[`electricity_quality_site_${id}_`] = { value: '' };
            output[`diesel_genset_operational_site_${id}_`] = { value: '' };
            output[`number_of_diesel_gensets_site_${id}_`] = { value: '' };
            output[`device_list_site_${id}_`] = { value: '' };
            output[`total_kva_capacity_of_diesel_gensets_site_${id}_`] = {
              value: ''
            };
            output[`monthly_running_cost_of_diesel_gensets_site_${id}_`] = {
              value: ''
            };
            output[`adopted_solar_site_${id}_`] = { value: '' };
            output[`solar_capacity_kwp_site_${id}_`] = { value: '' };
            output[`solar_generator_operational_since_site_${id}_`] = {
              value: ''
            };
            output[`solar_panel_oem_site_${id}_`] = { value: '' };
            output[`solar_invertor_oem_site_${id}_`] = { value: '' };
            output[`solar_installer_site_${id}_`] = { value: '' };
            output[`solar_generator_maintenance_contract_site_${id}_`] = {
              value: ''
            };
            output[`cost_of_solar_amc_site_${id}_`] = { value: '' };
            Object.keys(properties).forEach(key => {
              if (key === 'device_pool') {
                //get device_pool key and save it in Redux storage
                pool = properties[key].value;
                if (properties[key].value !== '') {
                  //validaion check for any ', replaced with "
                  let name = properties[key].value.replace(/'/g, '"');
                  pool = JSON.parse(name);
                }
              }
            });
            Object.keys(output).forEach(key => {
              if (properties[key] && properties[key].value !== 'undefined') {
                output[key] = properties[key];
              }
            });

            dispatch({
              type: SET_VID,
              payload: vid
            });
            dispatch({
              type: DEVICE_POOL,
              payload: pool
            });
            dispatch({
              type: OUTPUT_ARR,
              payload: output
            });
            resolve(true);
          })
          .catch(res => {
            if (res.status === 401) {
              localStorage.clear();
              window.location.href = '/login';
              resolve(false);
            }
          });
      }
    } else {
      //if its the first connection
      if (typeof localStorage.jwtToken !== 'undefined') {
        let jwt = localStorage.jwtToken;

        jwt = jwtDecode(jwt);
        const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
          jwt.sub
        }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

        axios
          .get(URL)
          .then(res => {
            //get keys and properties of 1st site
            const properties = res.data.properties;
            let pool;
            const vid = res.data.vid;
            let output = {};
            output[`gps_coordinate`] = { value: '' };
            output[`address`] = { value: '' };
            output[`city`] = { value: '' };
            output[`state`] = { value: '' };
            output[`zip`] = { value: '' };
            output[`master_site1`] = { value: '' };
            output[`electricity_connection_name`] = { value: '' };
            output[`connected_load_kw_`] = { value: '' };
            output[`segment`] = { value: '' };
            output[`sub_segment`] = { value: '' };
            output[`monthly_energy_cost`] = { value: '' };
            output[`electricity_quality`] = { value: '' };
            output[`diesel_genset_operational_`] = { value: '' };
            output[`number_of_diesel_gensets`] = { value: '' };
            output[`total_kva_capacity_of_diesel_gensets`] = { value: '' };
            output[`monthly_running_cost_of_diesel_gensets`] = { value: '' };
            output[`adopted_solar`] = { value: '' };
            output[`total_capacity_kwp`] = { value: '' };
            output[`device_id`] = { value: '' };
            output[`solar_generator_operational_since`] = { value: '' };
            output[`solar_panel_oem`] = { value: '' };
            output[`solar_inverter_oem`] = { value: '' };
            output[`installer`] = { value: '' };
            output[`solar_generator_amc_`] = { value: '' };
            output[`cost_of_amc`] = { value: '' };
            Object.keys(properties).forEach(key => {
              if (key === 'device_pool') {
                //get device_pool key and save it in Redux storage
                pool = properties[key].value;
                if (properties[key].value !== '') {
                  //validaion check for any ', replaced with "
                  let name = properties[key].value.replace(/'/g, '"');
                  pool = JSON.parse(name);
                }
              }
            });
            Object.keys(output).forEach(key => {
              if (properties[key] && properties[key].value !== 'undefined') {
                output[key] = properties[key];
              }
            });

            dispatch({
              type: SET_VID,
              payload: vid
            });
            dispatch({
              type: DEVICE_POOL,
              payload: pool
            });
            dispatch({
              type: OUTPUT_ARR,
              payload: output
            });
            resolve(true);
            resolve(true);
          })
          .catch(res => {
            if (res.status === 401) {
              localStorage.clear();
              window.location.href = '/login';
              resolve(false);
            }
          });
      }
    }
  });
};
export const updatePool = id => dispatch => {
  return new Promise((resolve, reject) => {
    //if its not the first connection
  });
};
