import { SET_USER, SET_USER_OUT, SET_PIN, SET_ADDRESS } from '../actionTypes'

export const setUser = data => {
  return dispatch => {
    dispatch({
      type: SET_USER,
      data,
    })
  }
}

export const setPin = data => {
  return dispatch => {
    dispatch({
      type: SET_PIN,
      data,
    })
  }
}
export const setAddress = data => {
  return dispatch => {
    dispatch({
      type: SET_ADDRESS,
      data: dat,
    })
  }
}
export const setUserOut = () => {
  return dispatch => {
    dispatch({
      type: SET_USER_OUT,
    })
  }
}
