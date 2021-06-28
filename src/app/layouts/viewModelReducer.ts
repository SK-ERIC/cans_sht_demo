import { combineReducers } from '@reduxjs/toolkit';

import selectionReducer from './slice/selectionSlice';

const viewModelReducer = combineReducers({
  selection: selectionReducer
});

export default viewModelReducer;
