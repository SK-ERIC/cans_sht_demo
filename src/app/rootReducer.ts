import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import modelReducer from './modifiers/modelSlice';
import viewModelReducer from './layouts/viewModelReducer';
import counterReducer from '../features/counter/counterSlice';

const rootReducer = combineReducers({
  model: modelReducer,
  viewModel: viewModelReducer,
  counter: counterReducer
});

export default rootReducer;
