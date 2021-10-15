import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store'

import thunk from 'redux-thunk'

// Secure storage
const storage = createSecureStore()
const config = {
  key: 'root',
  storage,
}

import user from './reducers/user'
const rootReducer = persistCombineReducers(config, {
  user,
})

export let store = createStore(rootReducer, applyMiddleware(thunk))
export let persistor = persistStore(store)
