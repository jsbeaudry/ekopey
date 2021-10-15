/* eslint-disable no-useless-escape */
import React, { useState } from 'react'
import {
  View,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native'
import { Feather } from 'react-native-vector-icons'
import { useTheme, makeStyles } from 'react-native-elements'
import { useActionSheet } from '@expo/react-native-action-sheet'

import { BACKEND_URL, PHONE_AREA_CODES } from '@utils/constants'
import axios from 'axios'
import { connect } from 'react-redux'

import { setUser } from '@reduxActions/user'
import { RFValue } from 'react-native-responsive-fontsize'
import { userAdd } from '@services/user'
const logo = require('@assets/images/logo-white.png')

const Inicial = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)
  const { showActionSheetWithOptions } = useActionSheet()

  const [securePass, setSecurePass] = useState(true)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [username, setUsername] = useState('')

  const [areacode, setAreaCode] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const validateEmail = emailAdress => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (emailAdress.match(regexEmail)) {
      return true
    } else {
      return false
    }
  }
  const getPhoneArea = () => {
    const options = [...PHONE_AREA_CODES.map(m => m.name), 'Cancel']
    const destructiveButtonIndex = options.length - 1
    const cancelButtonIndex = options.length - 1

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex !== cancelButtonIndex) setAreaCode(PHONE_AREA_CODES[buttonIndex].number)
      },
    )
  }
  const login = () => {
    // Request API.

    userAdd({
      // firstname: firstname,
      // lastname: lastname,
      username: username,
      phone: `${areacode}${phone}`,
      email: email,
      password: password,
      confirmed: true,
      isValidated: true,
      blocked: false,
      level: 'normal',
    })
      .then(response => {
        // Handle success.
        console.log('Well done!')
        console.log('User profile', response.data.user)
        // console.log('User token', response.data.jwt);
        if (response.data.user) {
          const storeUser = {
            token: response.data.jwt,
            user: response.data.user,
          }
          props.setUser(storeUser)

          setMessage('')
          setPhone('')
          setEmail('')
          setPassword('')
          setPhone('')
          setAreaCode('')
          // alert('Welcome ' + username)
          props.navigation.push('Home')
        }
        // if (response.data.user) {
        //   setMessage('')
        //   setPhone('')
        //   setEmail('')
        //   setPassword('')
        //   alert('Votre compte a été créé avec succès, veuillez confirmer votre email de récupération')
        //   props.navigation.push('Inicial')
        // }
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error.response)
        if (error.response.data.message[0].messages[0].message)
          setMessage(error.response.data.message[0].messages[0].message)
      })
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bg1}
        source={{ uri: 'https://i.pinimg.com/736x/77/6b/64/776b64b764b509f427addaf8ae5ac992.jpg' }}>
        <View style={[styles.bg1, { backgroundColor: 'rgba(0,0,0,0.0)' }]}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingStyle}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* Logo Radio */}

            <Image source={logo} style={{ width: 130, height: 130, marginBottom: 30, resizeMode: 'contain' }} />
            {/* Input email */}

            {/* <View style={styles.inputWapper}>
              <TextInput
                placeholder="First Name"
                textBreakStrategy="simple"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                value={firstname}
                returnKeyType="done"
                onChangeText={text => setFirstname(text)}
              /> 
            </View>*/}

            {/* Input email */}

            <View style={styles.inputWapper}>
              <TextInput
                placeholder="User name"
                textBreakStrategy="simple"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                value={username}
                returnKeyType="done"
                onChangeText={text => setUsername(text)}
              />
            </View>

            {/* Input email */}
            <View style={styles.inputWapper}>
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                textBreakStrategy="simple"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                value={email}
                onChangeText={text => setEmail(text)}
              />
              <Feather
                name="check"
                style={[styles.iconStyleCheck, { color: !validateEmail(email) ? '#ccc' : theme.colors.black }]}
              />
            </View>
            {/* Input email */}
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={getPhoneArea}
                style={[styles.inputWapper, { width: '20%', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[{ textAlign: 'center' }]}>{areacode || 'Code'}</Text>
              </TouchableOpacity>
              <View style={[styles.inputWapper, { width: '59%', marginLeft: '1%' }]}>
                <TextInput
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  textBreakStrategy="simple"
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.placeholderColor}
                  style={styles.inputStyle}
                  value={phone}
                  maxLength={8}
                  returnKeyType="done"
                  onChangeText={text => setPhone(text)}
                />
              </View>
            </View>

            {/* Input Password */}
            <View style={styles.inputWapper}>
              <TextInput
                placeholder="Password"
                textBreakStrategy="simple"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                secureTextEntry={securePass}
                value={password}
                onChangeText={text => setPassword(text)}
              />
              <Feather
                name="eye"
                style={[styles.iconStyleEye, { color: password.length < 5 ? '#ccc' : theme.colors.black }]}
                onPress={() => {
                  setSecurePass(!securePass)
                }}
              />
            </View>
            <Text style={{ color: 'red' }}>{message}</Text>
            <TouchableOpacity
              style={styles.initialButton}
              onPress={() => {
                if (email.length < 3) {
                  alert('Check your email')
                } else if (password.length < 3) {
                  alert('Check your password')
                } else {
                  login()
                }
              }}>
              <View style={styles.rectangle2}>
                <Text style={styles.buttonText}>Create you account</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>{'Forgot password?'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigation.navigate('Inicial')}>
              <Text style={styles.forgotPassword}>{'I already have an account'}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  )
}

const useStyles = makeStyles((theme, props) => ({
  container: {
    backgroundColor: theme.colors.white,
    opacity: 1,
    flex: 1,
    width: '100%',
  },
  keyboardAvoidingStyle: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg1: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginWithYourStudCopy1: {
    width: 190,
    textAlign: 'center',
    color: theme.colors.white,
    fontSize: 15,
    marginTop: -30,
    marginBottom: 50,
  },
  forgotPassword: {
    textAlign: 'center',
    color: theme.colors.white,
    fontSize: 15,
    marginTop: 30,
  },
  initialButton: {
    height: 44,
    width: '80%',
    marginTop: 30,
    backgroundColor: '#999',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    textAlign: 'center',
    color: theme.colors.white,
    fontSize: 15,
  },

  signupButton: {
    height: 44,
    width: '80%',
    marginTop: 10,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grey0,
  },
  inputWapper: {
    width: '80%',
    height: 44,
    backgroundColor: theme.colors.grey1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 4,
  },
  inputStyle: {
    color: theme.colors.grey2,
    paddingRight: 5,
    fontSize: 15,
    alignSelf: 'stretch',
    flex: 1,
    paddingHorizontal: 15,
  },
  iconStyleCheck: {
    color: theme.colors.grey3,
    fontSize: 25,
    paddingRight: 8,
  },
  iconStyleEye: {
    fontSize: 25,
    paddingRight: 8,
  },
}))

const mapStateToProps = state => ({
  logged: state.user.logged,
})

const mapDispatchToProps = {
  setUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Inicial)
