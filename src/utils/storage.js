import AsyncStorage from '@react-native-async-storage/async-storage'

/*
Set User
*/
export const setData = async (key, data) => {
  try {
    return await AsyncStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    // saving error
  }
}

/*
Get User
*/
export const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)

    return jsonValue !== null ? JSON.parse(jsonValue) : null
  } catch (e) {
    // error reading value
  }
}
