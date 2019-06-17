import { apiCall, setTokenHeader } from "../services/api";
import { SET_CURRENT_USER, ERROR } from "../actions/types";
import { fetchUserData } from "./userData";
export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}

export function setAuthorizationToken(token) {
  setTokenHeader(token);
}

export function logout() {
  return dispatch => {
    localStorage.clear();
    setAuthorizationToken(false);
    //window.location.reload();
    dispatch(setCurrentUser({}));
  };
}

//authUser is a redux function, takes dispatch as argument
//userData is the Object which contains username and password that needs to be sent to backend for auth

/*

        !!!! --------- IMPORTANT ---------- !!!!

        We are storing password for the user in LOCAL STORAGE beacuse of the issue with refresh tokens
        this email and password are used to prevent user from logging out and sends req to server for new token
        every 10 mins

        
      */

export function authUser(type, userData) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return apiCall(
        "post",
        "https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/auth/login",
        userData
      )
        .then(async res => {
          //if successfull login set localstorages,
          //we are stroing
          localStorage.setItem("email", userData.username);
          localStorage.setItem("password", userData.password);
          localStorage.setItem("jwtToken", res.token);
          localStorage.setItem("refreshToken", res.refreshToken);
          setAuthorizationToken(res.token);
          dispatch(setCurrentUser(res.token));
          fetchUserData();
          resolve();
        })
        .catch(err => {
          window.location.href = "/login";
          dispatch({
            type: ERROR,
            payload: "Invaild Email/Password"
          });
        });
    });
  };
}

const userEmail = localStorage.email;
const userPassword = localStorage.password;
const refreshData = {
  username: userEmail,
  password: userPassword
};

export const refreshUser = () => {
  ff();
};

const ff = () => {
  //apiCall is the function from /src/services/api.js which uses axios with proper headers
  apiCall(
    "post",
    "https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/auth/login",
    refreshData
  )
    .then(async res => {
      localStorage.setItem("userData", res);
      localStorage.setItem("jwtToken", res.token);
      localStorage.setItem("refreshToken", res.refreshToken);
      setAuthorizationToken(res.token);
    })
    .catch(err => {
      window.location.href = "/login";
      localStorage.clear();
      window.location.href = "/login";
    });
};
