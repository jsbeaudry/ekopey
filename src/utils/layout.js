import { Platform, Dimensions } from 'react-native'

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height
export const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896
export const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 44
export const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64
