import React, { useState, useEffect } from 'react'
import { View, StatusBar, Platform, KeyboardAvoidingView, Text, TextInput, ImageBackground } from 'react-native'
import { makeStyles, useTheme, Header, Button } from 'react-native-elements'
import { useActionSheet } from '@expo/react-native-action-sheet'

import { Ionicons } from 'react-native-vector-icons'
import { ScreenWidth } from 'react-native-elements/dist/helpers'
import { BACKEND_URL } from '@utils/constants'
import { connect } from 'react-redux'
import axios from 'axios'
import { RFValue } from 'react-native-responsive-fontsize'
import { setUser } from '@reduxActions/user'
import { TouchableOpacity } from 'react-native-gesture-handler'
const techImage = require('@assets/images/techimage.jpg')

const Profile = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)
  const { showActionSheetWithOptions } = useActionSheet()

  const [user, setUser] = useState(null)
  const [edit, setEdit] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const [sex, setSex] = useState('Sex')

  useEffect(() => {
    setFirstname(props.user.user ? props.user.user.firstname : '')
    setLastname(props.user.user ? props.user.user.lastname : '')
    setPhone(props.user.user ? props.user.user.phone : '')
  }, [props.user])
  useEffect(() => {
    // setUser(props.user.user)
    getUser()
  }, [])

  const getUser = () => {
    // Request API.

    const userdata = props.user.user

    let req = `${BACKEND_URL}/users/${userdata.id}`

    axios
      .get(req, {
        headers: {
          Authorization: `Bearer ${props.user.token}`,
        },
      })
      .then(response => {
        // Handle success.
        console.log('Well done!')

        setFirstname(response.data.firstname)
        setLastname(response.data.lastname)
        setPhone(response.data.phone)
        setSex(response.data.sex)
        const storeUser = {
          token: props.user.token,
          user: response.data,
        }
        props.setUser(storeUser)
      })
      .catch(error => {
        console.log('Bad', error)
      })
  }
  const update = nonEdit => {
    let req = `${BACKEND_URL}/users/${props.user.user._id}`
    axios
      .put(
        req,
        {
          firstname,
          lastname,
          phone,
          sex,
        },
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        },
      )
      .then(response => {
        // Handle success.
        getUser()
        if (nonEdit) setEdit(false)
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error.response)
        alert("Votre compte n'a pas été mise à jour")
      })
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} />
      <ImageBackground style={{ width: '100%', height: RFValue(80) }} source={techImage}>
        <Header
          backgroundColor={'rgba(0,0,0,0)'}
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content"
          containerStyle={{ borderBottomWidth: 0 }}
          leftComponent={() => (
            <Ionicons
              name="arrow-back"
              color={theme.colors.white}
              style={{}}
              size={RFValue(30)}
              onPress={() => props.navigation.goBack()}
            />
          )}
          centerComponent={{ text: 'Profile', style: { color: theme.colors.white, fontSize: RFValue(20) } }}
          rightComponent={() => (
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                name="create-outline"
                color={theme.colors.white}
                size={RFValue(30)}
                onPress={() => {
                  setEdit(true)
                }}
              />
              <Ionicons
                name="menu"
                color={theme.colors.white}
                size={RFValue(30)}
                onPress={() => props.navigation.openDrawer()}
              />
            </View>
          )}
        />
      </ImageBackground>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {props.user && props.user.user && (
          <View style={{ padding: 15, width: ScreenWidth }}>
            {/* Logo Radio */}

            <View style={styles.inputWapper}>
              <TextInput
                editable={false}
                placeholder="Email"
                textBreakStrategy="simple"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                value={props.user && props.user.user ? props.user.user.email : ''}
                onChangeText={text => {}}
              />
            </View>
            <View style={styles.inputWapper}>
              <TextInput
                editable={false}
                placeholder="User name"
                textBreakStrategy="simple"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                value={props.user && props.user.user ? props.user.user.username : ''}
                onChangeText={text => {}}
              />
            </View>
            <View style={[styles.inputWapper, edit === true ? { borderColor: 'green', borderWidth: 1 } : {}]}>
              <TextInput
                editable={edit === true}
                textBreakStrategy="simple"
                placeholder="First name"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                value={firstname}
                onChangeText={text => setFirstname(text)}
                returnKeyType="done"
              />
            </View>
            <View style={[styles.inputWapper, edit === true ? { borderColor: 'green', borderWidth: 1 } : {}]}>
              <TextInput
                editable={edit === true}
                placeholder="Last name"
                textBreakStrategy="simple"
                placeholder="Last name"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                value={lastname}
                returnKeyType="done"
                onChangeText={text => setLastname(text)}
              />
            </View>
            <View style={[styles.inputWapper, edit === true ? { borderColor: 'green', borderWidth: 1 } : {}]}>
              <TextInput
                editable={edit === true}
                placeholder="Phone"
                textBreakStrategy="simple"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                value={phone}
                maxLength={11}
                returnKeyType="done"
                onChangeText={text => setPhone(text)}
              />
            </View>

            <TouchableOpacity
              style={[
                {
                  width: '90%',
                  height: RFValue(44),
                  backgroundColor: theme.colors.grey1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                  borderRadius: 4,
                  alignSelf: 'center',
                },
              ]}
              onPress={() => {
                const options = ['Male', 'Female', 'Cancel']
                const destructiveButtonIndex = 2
                const cancelButtonIndex = 2

                showActionSheetWithOptions(
                  {
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex,
                  },
                  buttonIndex => {
                    if (buttonIndex !== 2) setSex(options[buttonIndex])

                    // update(true)
                  },
                )
              }}>
              <Text style={{ color: theme.colors.grey2, marginLeft: 20 }}>{sex}</Text>
            </TouchableOpacity>

            <Button
              title="Update"
              buttonStyle={{ height: RFValue(40), backgroundColor: '#000' }}
              titleStyle={{ fontSize: RFValue(15) }}
              containerStyle={{ width: RFValue(200), alignSelf: 'center', marginTop: 30 }}
              onPress={() => {
                update(true)
              }}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  )
}

const useStyles = makeStyles((theme, props) => ({
  container: {
    flex: 1,
    width: '100%',
  },
  keyboardAvoidingStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  inputWapper: {
    width: '90%',
    height: RFValue(44),
    backgroundColor: theme.colors.grey1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 4,
    alignSelf: 'center',
  },
  inputStyle: {
    color: theme.colors.grey2,
    paddingRight: 5,
    fontSize: RFValue(12),
    alignSelf: 'stretch',
    flex: 1,
    paddingHorizontal: 15,
  },
  iconStyleCheck: {
    color: theme.colors.grey3,
    fontSize: RFValue(24),
    paddingRight: 8,
  },
  iconStyleEye: {
    fontSize: RFValue(24),
    paddingRight: 8,
  },
}))

const mapStateToProps = state => ({
  logged: state.user.logged,
  user: state.user.user,
})

const mapDispatchToProps = { setUser }

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
