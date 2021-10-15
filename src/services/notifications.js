/**
 * Send new Notification
 * Method - POST
 *
 * @param {Object} data
 * @return {Promise}
 */

export const sendPushNotification = (expoPushToken, data) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: data.title,
    body: data.body,
    data,
  }

  return fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
}
