import axios from "axios";
import { FETCH_CONNECTION_INFO, MAP_RAW_DATA_TO_MODIFIED_DATA, SET_VID } from "./types";
import jwtDecode from "jwt-decode";

export const fetchConnetionInfo = id => dispatch => {
  return new Promise((resolve, reject) => {
    if (id > 1) {
      if(typeof localStorage.jwtToken !== "undefined")
      {
        let jwt = localStorage.jwtToken;
        jwt = jwtDecode(jwt);
      
      const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
        jwt.sub
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

      axios.get(URL).then(res => {
        const properties = res.data.properties;
        const vid = res.data.vid;
        let arrayOfStrings = [];
        console.log(properties);
        Object.keys(properties).forEach(key => {
          arrayOfStrings.push(key);
        });
        let result = [];
        let resultObject = {};
        arrayOfStrings.forEach(subString => {
          if (subString.includes(id)) {
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
        resolve(true);
      });
    }
    } else {
      if(typeof localStorage.jwtToken !== "undefined")
      {
      let jwt = localStorage.jwtToken;
      
      jwt = jwtDecode(jwt);
      const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
        jwt.sub
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

      axios.get(URL).then(res => {
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
      });
    }
  }
  });

};
