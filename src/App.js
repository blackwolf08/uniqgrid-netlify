import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import jwtDecode from "jwt-decode";
import { setAuthorizationToken, setCurrentUser } from "./actions/auth";
import Login from "./components/Login";
import { refreshUser } from "./actions/auth";

if (typeof localStorage.jwtToken !== "undefined") {
  setAuthorizationToken(localStorage.jwtToken);
  try {
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
  } catch {
    store.dispatch(setCurrentUser({}));
  }
}

setInterval(() => {
  console.log("ji");
  refreshUser();
}, 600000);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Login />
      </Router>
    </Provider>
  );
}

export default App;
