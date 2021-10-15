import React, { useState } from 'react'
import axios from 'axios'

import { ImageBackground, StatusBar, Alert, Text, TextInput, View, Switch, ActivityIndicator } from 'react-native'
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native'
import { Ionicons } from 'react-native-vector-icons'
import { connect } from 'react-redux'
import { makeStyles, useTheme, Header } from 'react-native-elements'
import { setUser, setAddress } from '@reduxActions/user'
import { sellMoney } from '@services/solana'
import { userAddTx } from '@services/user'
import { NETWORK } from '@env'

import Button from './Button'
import PaymentScreen from './PaymentScreen'
import { BACKEND_URL, USDC_ADDRESS, USDC_DECIMAL } from '@utils/constants'
const techImage = require('@assets/images/techimage.jpg')

const WebhookPaymentScreen = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)
  const [email, setEmail] = useState(props.user && props.user.user ? props.user.user.email : '')
  const [amount, setAmount] = useState('10')

  const [saveCard, setSaveCard] = useState(false)
  const [done, setDone] = useState(true)

  const { confirmPayment, loading } = useConfirmPayment()

  const fetchPaymentIntentClientSecret = async () => {
    const response = await axios.post(
      `${BACKEND_URL}/wallets/stripepayment`,
      { amount: parseFloat(amount), metadata: { name: 'email' }, currency: 'usd' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.user.token}`,
        },
      },
    )

    console.log(response)
    const { clientSecret } = response.data

    return clientSecret
  }

  const handlePayPress = async () => {
    setDone(false)
    // 1. fetch Intent Client Secret from backend
    const clientSecret = await fetchPaymentIntentClientSecret()
    console.log(clientSecret)
    // 2. Gather customer billing information (ex. email)
    const billingDetails = {
      email: email,
      phone: '+48888000888',
      addressCity: 'Houston',
      addressCountry: 'US',
      addressLine1: '1459  Circle Drive',
      addressLine2: 'Texas',
      addressPostalCode: '77063',
    } // mocked data for tests

    // 3. Confirm payment with card details
    // The rest will be done automatically using webhooks
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails,
      setupFutureUsage: saveCard ? 'OffSession' : undefined,
    })
    console.log(error)
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
      console.log('Payment confirmation error', error.message)
      setDone(true)
    } else if (paymentIntent) {
      console.log('Success from promise', paymentIntent)

      if (props.user && props.user.user && props.user.user.walletid) {
        //  console.log(props.user.user.walletid.publicKey)

        const address = props.user.user.walletid.publicKey
        sellMoney(
          {
            receiver: address,
            amount: parseFloat(amount),
            tokenid: USDC_ADDRESS,
            tokenDecimal: USDC_DECIMAL,
          },
          props.user.token,
        ).then(async resp => {
          userAddTx(
            {
              sender: '615666bd8138da0016668741',
              receiver: props.user.user.id,
              amount: parseFloat(amount),
              signature: resp.data.signature,
              currency: 'USDC',
              network: NETWORK,
            },
            props.user.token,
          ).then(resp2 => {
            setDone(true)
            Alert.alert('Success', 'The payment was confirmed successfully', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              { text: 'OK', onPress: () => props.navigation.push('Home') },
            ])
            //  Alert.alert('Success', `The payment was confirmed successfully! currency: ${paymentIntent.currency}`)
            console.log('Success from promise', paymentIntent)
          })
        })
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} />
      <ImageBackground style={{ width: '100%', height: 80 }} source={techImage}>
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
              size={30}
              onPress={() => props.navigation.goBack()}
            />
          )}
          centerComponent={{ text: 'Recharge Wallet', style: { color: theme.colors.white, fontSize: 20 } }}
          rightComponent={() => (
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                name="menu"
                color={theme.colors.white}
                size={30}
                onPress={() => props.navigation.openDrawer()}
              />
            </View>
          )}
        />
      </ImageBackground>
      {/* <StripeProvider publishableKey={STRIPE_KEY}> */}

      <PaymentScreen>
        <Text style={{ fontSize: 15, color: 'green' }}>Test card: 4242 4242 4242 4242 </Text>

        <TextInput
          autoCapitalize="none"
          placeholder="E-mail"
          keyboardType="email-address"
          value={email}
          // onChange={value => setEmail(value.nativeEvent.text)}
          style={styles.input}
        />

        <TextInput
          autoCapitalize="none"
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          maxLength={2}
          // onChangeText={value => setAmount(value)}
          style={styles.input}
          returnKeyType="done"
        />

        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: '4242 4242 4242 4242',
            postalCode: '12345',
            cvc: 'CVC',
            expiration: 'MM|YY',
          }}
          onCardChange={cardDetails => {
            console.log('cardDetails', cardDetails)
          }}
          onFocus={focusedField => {
            console.log('focusField', focusedField)
          }}
          cardStyle={inputStyles}
          style={styles.cardField}
        />

        <View style={styles.row}>
          <Switch onValueChange={value => setSaveCard(value)} value={saveCard} />
          <Text style={styles.text}>Save card during payment</Text>
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text>Only for testing:</Text>
          <Text>{`Your'll receie: $${amount ? parseFloat(amount) : 0}`}</Text>
        </View>

        <Button variant="primary" onPress={handlePayPress} title="Pay" loading={loading} />
        {done === false && <ActivityIndicator size="large" style={{ margin: 10 }} />}
      </PaymentScreen>

      {/* </StripeProvider> */}
    </View>
  )
}

const useStyles = makeStyles((theme, props) => ({
  container: {
    flex: 1,
    width: '100%',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    marginLeft: 12,
  },
  input: {
    height: 44,
    borderBottomColor: '#eee',
    borderBottomWidth: 1.5,
  },
}))
const inputStyles = {
  borderWidth: 1,
  backgroundColor: '#FFFFFF',
  borderColor: '#000000',
  borderRadius: 8,
  fontSize: 14,
  placeholderColor: '#999999',
}

const mapStateToProps = state => ({
  logged: state.user.logged,
  user: state.user.user,
})

const mapDispatchToProps = { setUser, setAddress }

export default connect(mapStateToProps, mapDispatchToProps)(WebhookPaymentScreen)
