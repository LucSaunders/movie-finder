import { combineReducers } from "redux";
import MoviesReducer from "./reducer-movies";
import AuthReducer from './reducer-auth';
import { reducer as formReducer } from 'redux-form';


const rootReducer = combineReducers({
  movies: MoviesReducer,
  form: formReducer,
  auth: AuthReducer
  });
  
  export default rootReducer;
