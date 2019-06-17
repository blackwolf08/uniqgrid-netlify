import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import jwtDecode from "jwt-decode";
import { setAuthorizationToken, setCurrentUser } from "./actions/auth";
import RouteController from "./components/RouteController";

//this is the parent element of all the components

if (typeof localStorage.jwtToken !== "undefined") {
  // if jwt defined then set user and authenticate
  setAuthorizationToken(localStorage.jwtToken);
  try {
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
  } catch {
    // anything goes wrong or user tampers with jwt then setCurrent user empty this would logout that user
    store.dispatch(setCurrentUser({}));
  }
}

function App() {
  //provider component so that each component have access to store
  return (
    <Provider store={store}>
      <Router>
        {/* RouteController would be the second component in out component tree */}
        <RouteController />
      </Router>
    </Provider>
  );
}

export default App;
