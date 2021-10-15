import axios from 'axios'
import { BACKEND_URL, SOLANA_URL } from '@utils/constants'

/**
 * Get Account  info
 * Method - GET
 *
 * @param {String} id
 * @return {Promise}
 */

export const getAccountInfo = async address => {
  try {
    return axios.post(`${SOLANA_URL}/`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [`${address}`],
    })
  } catch (error) {
    return { success: false }
  }
}
/**
 * Get Account  Tokens
 * Method - POST
 *
 * @param {String}
 * @return {Promise}
 */
export const getAccountTokens = async address => {
  try {
    return axios.post(`${SOLANA_URL}/`, {
      method: 'getTokenAccountsByOwner',
      jsonrpc: '2.0',
      params: [
        `${address}`,
        {
          programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          encoding: 'jsonParsed',
          commitment: 'processed',
        },
      ],
      id: 'c467471d-6edc-4b10-a97a-7b76c9257594',
    })
  } catch (error) {
    return { success: false }
  }
}
/**
 * Get Account
 * Method - POST
 *
 * @param {String}
 * @return {Promise}
 */
export const getAccountTransactions = async (address, limit = 10) => {
  try {
    return axios.post(`${SOLANA_URL}/`, {
      method: 'getSignaturesForAddress',
      jsonrpc: '2.0',
      params: [`${address}`, { limit: 200 }],
      id: '2e53712f-361b-4e6b-87b8-2fcb39921d99',
    })
  } catch (error) {
    return { success: false }
  }
}

/**
 * Wallet send SLP token
 * Method - POST
 *
 * @param {Object}
 * @return {Promise}
 */
export const sendMoney = async (data, token) => {
  console.log(data)
  try {
    const apiURL = `${BACKEND_URL}/wallets/sendslptoken`
    return axios.post(`${apiURL}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}
/**
 * Wallet sell SLP token
 * Method - POST
 *
 * @param {Object}
 * @return {Promise}
 */
export const sellMoney = async (data, token) => {
  try {
    const apiURL = `${BACKEND_URL}/wallets/sellslptoken`
    return axios.post(`${apiURL}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Wallet create wallet
 * Method - POST
 *
 * @param {String, Integer}
 * @return {Promise}
 */
export const createWallet = async token => {
  try {
    const apiURL = `${BACKEND_URL}/wallets`
    return axios.post(
      `${apiURL}`,
      {},
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
 * Wallet add SOL for fees
 * Method - GET
 *
 * @param {String, Integer}
 * @return {Promise}
 */
export const reFillWallet = async (address, amount, token) => {
  try {
    const apiURL = `${BACKEND_URL}/wallets/refeedwallet/${address}/${amount}`
    return axios.get(`${apiURL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Lending Info
 * Method - GET
 *
 * @param {String}
 * @return {Promise}
 */

export const getApricotData = async (publicKey, token) => {
  try {
    const apiURL = `${BACKEND_URL}/wallets/apricotdata/${publicKey}`
    return axios.get(`${apiURL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Lending Deposit
 * Method - POST
 *
 * @param {Object}
 * @return {Promise}
 */
export const setApricotLending = async (data, token) => {
  try {
    const apiURL = `${BACKEND_URL}/wallets/apricot-lending`
    return axios.post(`${apiURL}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}

/**
 * Lending Withdraw
 * Method - POST
 *
 * @param {Object}
 * @return {Promise}
 */
export const setApricotWithdraw = async (data, token) => {
  try {
    const apiURL = `${BACKEND_URL}/wallets/apricot-withdraw`
    return axios.post(`${apiURL}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return { success: false, result: error }
  }
}
