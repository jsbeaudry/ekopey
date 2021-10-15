import axios from 'axios'
import { BACKEND_URL } from '@utils/constants'
import { NETWORK } from '@env'

/**
 * Create User
 * Method - POST
 *
 * @param {Object}
 * @return {Promise}
 */

export const userAdd = async data => {
  try {
    return axios.post(`${BACKEND_URL}/auth/local/register`, data)
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Get User by id
 * Method - GET
 *
 * @param {String}
 * @return {Promise}
 */
export const getUser = async (id, token) => {
  try {
    return axios.get(`${BACKEND_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Update User by id
 * Method - PUT
 *
 * @param {String, Object}
 * @return {Promise}
 */
export const userUpdate = async (id, data, token) => {
  try {
    console.log(id)
    return axios.put(`${BACKEND_URL}/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {}
}

/**
 * Search User by name
 * Method - GET
 *
 * @param {String}
 * @return {Promise}
 */
export const userSearch = async (name, token) => {
  try {
    return axios.get(
      `${BACKEND_URL}/users?_where[_or][0][username_contains]=${name}&_where[_or][1][phone_contains]=${name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  } catch (error) {}
}

/**
 * Follow User by id
 * Method - GET
 *
 * @param {String}
 * @return {Promise}
 */
export const userFollowing = async (id, token) => {
  try {
    return axios.get(`${BACKEND_URL}/follows?follower_eq=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {}
}

/**
 * get  User followers by id
 * Method - GET
 *
 * @param {String}
 * @return {Promise}
 */
export const userFollowers = async (id, token) => {
  try {
    return axios.get(`${BACKEND_URL}/follows?user_eq=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {}
}

/**
 * Follow User
 * Method - POST
 *
 * @param {Object}
 * @return {Promise}
 */
export const userAddFollow = async (data, token) => {
  try {
    return axios.post(`${BACKEND_URL}/follows`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Unfollow User by id
 * Method - DELETE
 *
 * @param {String}
 * @return {Promise}
 */
export const userDeleteFollow = async (id, token) => {
  try {
    return axios.delete(`${BACKEND_URL}/follows/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Update user  follows
 * Method - PUT
 *
 * @param {String, Object}
 * @return {Promise}
 */
export const userUpdateFollow = async (id, data, token) => {
  try {
    return axios.put(`${BACKEND_URL}/follows/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Get User transaction by id
 * Method - GET
 *
 * @param {String}
 * @return {Promise}
 */
export const userGetTx = async (id, token) => {
  try {
    return axios.get(
      `${BACKEND_URL}/transactions?network=${NETWORK}&type_ne=LEND&_where[_or][0][sender_eq]=${id}&_where[_or][1][receiver_eq]=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Get User  Lending by id
 * Method - GET
 *
 * @param {String}
 * @return {Promise}
 */

export const userGetTxLend = async (id, token) => {
  try {
    return axios.get(
      `${BACKEND_URL}/transactions?network=${NETWORK}&&type_eq=LEND&_where[_or][0][sender_eq]=${id}&_where[_or][1][receiver_eq]=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Add User transaction
 * Method - POST
 *
 * @param {Object}
 * @return {Promise}
 */

export const userAddTx = async (data, token) => {
  try {
    return axios.post(`${BACKEND_URL}/transactions`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}
