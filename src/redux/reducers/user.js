import { SET_USER, SET_USER_OUT, SET_PIN, SET_ADDRESS } from '../actionTypes'

const INTIAL_STATE = {
  user: {},
  address: 'G2XjAa4F8aKrCQPe3v9rmAQa99tJj4YHfX2LShS6fHrS',
  usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  logged: false,
  pin: '',
}

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.data,
        logged: true,
      }
    case SET_ADDRESS:
      return {
        ...state,
        address: action.data,
      }

    case SET_PIN:
      return {
        ...state,
        pin: action.data,
      }
    case SET_USER_OUT:
      return {
        ...state,
        user: {},
        logged: false,
      }

    default:
      return state
  }
}
