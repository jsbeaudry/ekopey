import Areacode from './areacodes'
import { NETWORK } from '@env'
export const TOKEN_KEY = '@auth_token'
export const USER_ID_KEY = '@user_id'

// export const BACKEND_URL = 'https://solana-wallet-prod.herokuapp.com'
export const BACKEND_URL = 'https://solana-wllet-dev.herokuapp.com'
// export const BACKEND_URL = 'http://192.168.1.15:1337'

export const PROD_SOLANA_URL = 'https://prod-api.solana.surf/v1/'
export const SOLANA_URL =
  NETWORK.toString() === 'test' ? 'https://explorer-api.testnet.solana.com' : 'https://explorer-api.devnet.solana.com'

export const USDC_ADDRESS =
  NETWORK.toString() === 'test'
    ? 'CpMah17kQEL2wqyMKt3mZBdTnZbkbfx4nqmQMFDP5vwp'
    : 'BwNiXVdAYt5g5tGSn6Apadk72SEqzmEd3Tv2W5pgvWFM'

export const USDC_DECIMAL = NETWORK.toString() === 'test' ? 6 : 9

export const STRIPE_API_URL = 'https://expo-stripe-server-example.glitch.me'

export const PHONE_AREA_CODES = Areacode

export const customFonts = {
  MontserratMedium: require('@assets/fonts/Montserrat-Medium.ttf'),
  MontserratRegular: require('@assets/fonts/Montserrat-Regular.ttf'),
  PoppinsBold: require('@assets/fonts/Poppins-Bold.ttf'),
  PoppinsMedium: require('@assets/fonts/Poppins-Medium.ttf'),
  PoppinsSemiBold: require('@assets/fonts/Poppins-SemiBold.ttf'),
}
