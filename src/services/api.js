import axios from "axios";

export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common["X-Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["X-Authorization"];
  }
}

export function apiCall(method, path, data) {
  return new Promise((resolve, reject) => {
    return axios[method.toLowerCase()](path, data)
      .then(res => {
        return resolve(res.data);
      })
      .catch(err => {
          if(err.status === 401)
          {
            localStorage.clear();
            window.location.href = "/login";
          }
      });
  });
}
