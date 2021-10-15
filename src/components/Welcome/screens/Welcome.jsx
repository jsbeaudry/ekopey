import React, { useEffect, useState } from 'react'
import { View, StatusBar, Image, Text } from 'react-native'
import { makeStyles, useTheme } from 'react-native-elements'
import { getData } from '@utils/storage'
import { connect } from 'react-redux'

const Welcome = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)
  const [onboarding, setOnboarding] = useState(null)
  useEffect(() => {
    getData('onboarding').then(onboarding => {
      if (onboarding === 'done') {
        setOnboarding(true)
      } else {
        setOnboarding(false)
      }

      if (props.logged) {
        // alert(user_.jwt)
        props.navigation.navigate('Home')
      } else {
        setTimeout(() => {
          props.navigation.navigate(onboarding === 'done' ? 'Inicial' : 'Onboarding')
        }, 3000)
      }
    })
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'dark-content'} />
      <Text style={{ fontSize: 50, fontWeight: '700', color: theme.colors.white }}>EKOPEY</Text>
      {/* <Image source={logo} style={{ width: 200, resizeMode: 'contain' }} /> */}
    </View>
  )
}

const useStyles = makeStyles((theme, props) => ({
  container: {
    backgroundColor: theme.colors.black,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

const mapStateToProps = state => ({
  logged: state.user.logged,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
