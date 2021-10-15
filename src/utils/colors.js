import { Platform } from 'react-native'

const tintColor = '#4e9bde'
const darkTintColor = '#1a74b3'
const error = '#dc3545'

export default {
  absolute: '#fff',
  text: '#242c39',
  tintColor,
  darkTintColor,
  navBorderBottom: 'rgba(46, 59, 76, 0.10)',
  navBackgroundColor: '#fff',
  sectionLabelBackgroundColor: '#f8f8f9',
  sectionLabelText: '#a7aab0',
  bodyBackground: '#f8f8f9',
  cardBackground: '#fff',
  cardSeparator: '#f4f4f5',
  cardTitle: '#242c39',
  error,
  highlightColor: '#5944ed',
  tabIconDefault: '#bdbfc3',
  tabIconSelected: Platform.OS === 'android' ? '#000' : tintColor,
  tabBar: '#fff',
  noticeText: '#fff',
  greyBackground: '#f8f8f9',
  greyText: '#a7aab0',
  greyUnderlayColor: '#f7f7f7',
  blackText: '#242c39',
  separator: '#f4f4f5',
  refreshControl: undefined,
}
