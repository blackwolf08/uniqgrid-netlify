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

export function authUser(type, userData) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return apiCall(
        "post",
        "https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/auth/login",
        userData
      )
        .then(async res => {
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
          if (err.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
          }
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
      if (err.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    });
};
