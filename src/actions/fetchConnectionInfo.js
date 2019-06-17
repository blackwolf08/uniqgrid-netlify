import axios from "axios";
import {
  FETCH_CONNECTION_INFO,
  MAP_RAW_DATA_TO_MODIFIED_DATA,
  SET_VID,
  DEVICE_POOL
} from "./types";
import jwtDecode from "jwt-decode";

export const fetchConnetionInfo = id => dispatch => {
  return new Promise((resolve, reject) => {
    //if its not the first connection
    if (id > 1) {
      if (typeof localStorage.jwtToken !== "undefined") {
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
            let arrayOfStrings = [];
            Object.keys(properties).forEach(key => {
              arrayOfStrings.push(key);
              if (key === "device_pool") {
                //get device_pool key and save it in Redux storage
                pool = properties[key].value;
                if (properties[key].value !== "") {
                  //validaion check for any ', replaced with "
                  let name = properties[key].value.replace(/'/g, '"');
                  pool = JSON.parse(name);
                  pool = pool.device_list;
                }
              }
            });
            let result = [];
            let resultObject = {};
            //array of keys
            arrayOfStrings.forEach(subString => {
              if (subString.includes(id)) {
                result.push(subString);
              }
            });
            let output = {};
            let temp;
            //remove _ from the keys
            result.forEach(key => {
              temp = key.split("_");
              temp = temp.join(" ");
              resultObject[temp] = properties[key];
              output[key] = temp;
            });

            //dispatch all the actions from above
            dispatch({
              type: MAP_RAW_DATA_TO_MODIFIED_DATA,
              payload: output
            });
            dispatch({
              type: FETCH_CONNECTION_INFO,
              payload: resultObject
            });
            dispatch({
              type: SET_VID,
              payload: vid
            });
            dispatch({
              type: DEVICE_POOL,
              payload: pool
            });
            resolve(true);
          })
          .catch(res => {
            if (res.status === 401) {
              localStorage.clear();
              window.location.href = "/login";
              resolve(false);
            }
          });
      }
    } else {
      //if its the first connection
      if (typeof localStorage.jwtToken !== "undefined") {
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
            let arrayOfStrings = [];
            Object.keys(properties).forEach(key => {
              arrayOfStrings.push(key);
            });
            const vid = res.data.vid;
            let result = [];
            let resultObject = {};
            arrayOfStrings.forEach(subString => {
              if (!/\d/.test(subString)) {
                result.push(subString);
              }
            });
            let output = {};
            let temp;
            result.forEach(key => {
              temp = key.split("_");
              temp = temp.join(" ");
              resultObject[temp] = properties[key];
              output[key] = temp;
            });
            dispatch({
              type: FETCH_CONNECTION_INFO,
              payload: resultObject
            });
            dispatch({
              type: MAP_RAW_DATA_TO_MODIFIED_DATA,
              payload: output
            });
            dispatch({
              type: SET_VID,
              payload: vid
            });
            resolve(true);
          })
          .catch(res => {
            if (res.status === 401) {
              localStorage.clear();
              window.location.href = "/login";
              resolve(false);
            }
          });
      }
    }
  });
};
