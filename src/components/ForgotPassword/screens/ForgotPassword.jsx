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
  Alert,
} from 'react-native'
import { Feather } from 'react-native-vector-icons'
import { useTheme, makeStyles } from 'react-native-elements'
import { setData, getData } from '@utils/storage'
import { BACKEND_URL } from '@utils/constants'
import axios from 'axios'
import { connect } from 'react-redux'

import { setUser } from '@reduxActions/user'

const logo = require('@assets/images/logo-white.png')

const Inicial = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)

  const [securePass, setSecurePass] = useState(true)
  const [email, setEmail] = useState('')

  {
    /* Check if email is correct Before use Formik*/
  }

  const validateEmail = emailAdress => {
    // eslint-disable-next-line no-useless-escape
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (emailAdress.match(regexEmail)) {
      return true
    } else {
      return false
    }
  }

  const changePassword = () => {
    axios
      .post(`${BACKEND_URL}/auth/forgot-password`, {
        email: email,
      })
      .then(response => {
        console.log(response)
        Alert.alert('Password recovery', 'An email has been send to your mail box', [
          // {
          //   text: "Cancel",
          //   onPress: () => console.log("Cancel Pressed"),
          //   style: "cancel"
          // },
          { text: 'OK', onPress: () => props.navigation.navigate('Inicial') },
        ])

        //self.setState({ resetPass: true });
        console.log('Your user received an email')
      })
      .catch(error => {
        alert('Please retry')
        console.log('An error occurred:', error)
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
            {/* Logo Gaya */}

            <Image source={logo} style={{ width: 150, height: 150, marginBottom: 30, resizeMode: 'contain' }} />

            {/* Input email */}
            <View style={styles.inputWapper}>
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                textBreakStrategy="simple"
                placeholderTextColor={theme.colors.placeholderColor}
                style={styles.inputStyle}
                value={email}
                onChangeText={text => setEmail(text)}
              />
              <Feather
                name="check"
                style={[
                  styles.iconStyleCheck,
                  { color: validateEmail(email) ? theme.colors.green : theme.colors.grey3 },
                ]}
              />
            </View>

            <TouchableOpacity
              style={styles.initialButton}
              onPress={() => {
                if (!validateEmail(email)) {
                  alert('Please check your email')
                } else {
                  changePassword()
                }
              }}>
              <View style={styles.rectangle2}>
                <Text style={styles.buttonText}>Recover my password</Text>
              </View>
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
    height: 19,

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
    fontSize: 13,
    alignSelf: 'stretch',
    flex: 1,
    lineHeight: 16,
    paddingHorizontal: 15,
  },
  iconStyleCheck: {
    color: theme.colors.grey3,
    fontSize: 24,
    paddingRight: 8,
  },
  iconStyleEye: {
    fontSize: 24,
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
