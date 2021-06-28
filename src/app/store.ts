import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '@app/rootReducer';
import rootSaga from '@sagas/index';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middleware = getDefaultMiddleware({
  serializableCheck: false
}).concat(sagaMiddleware);

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production'
});

sagaMiddleware.run(rootSaga);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
