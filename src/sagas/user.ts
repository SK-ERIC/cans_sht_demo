import { all, delay, put, takeLatest } from 'redux-saga/effects';

/**
 * Login
 */
export function* login() {
  yield delay(400);

  yield put({
    type: 'USER_LOGIN_SUCCESS'
  });
}

/**
 * Logout
 */
export function* logout() {
  yield delay(200);

  yield put({
    type: 'USER_LOGOUT_SUCCESS'
  });
}

/**
 * User Sagas
 */
export default function* root() {
  yield all([takeLatest('USER_LOGIN_SUCCESS', login), takeLatest('USER_LOGOUT_SUCCESS', logout)]);
}
