import { USERDATA, CUSTOMERINFO, DEVICETYPES, LOADING } from "./types";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const fetchUserData = () => dispatch => {
  if(typeof localStorage.jwtToken !== "undefined")
  {
  const jwt = localStorage.jwtToken;
  const user = jwtDecode(localStorage.jwtToken);
  const userId = user.customerId;
  const URL = `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/customer/${userId}/devices?limit=10&textSearch=`;
  const header = `X-Authorization: Bearer ${jwt}`;
  axios
    .get(URL, { headers: { header } })
    .then(res => {
      dispatch({
        type: USERDATA,
        payload: res.data.data
      });
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/customer/${userId}`
        )
        .then(res => {
          dispatch({
            type: CUSTOMERINFO,
            payload: res
          });
          axios
            .get(
              `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/device/types`
            )
            .then(res => {
              dispatch({
                type: DEVICETYPES,
                payload: res
              });
              dispatch({
                type: LOADING,
                payload: false
              });
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
  }
};

