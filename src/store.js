import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

let middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middleware = [...middleware, logger];
}

export default createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middleware))
);
