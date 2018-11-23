const exchangePoints = (info, credentials) => {
  return fetch('/api/transactions/exchange/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: JSON.stringify(info)
  })
    .then((response) => {
      return response.json()
    }).catch((err) => console.log(err))
}

const myActivity = (user, credentials) => {
  return fetch('/api/transactions/myActivity/' + user.userId, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    }
  }).then((response) => {
    return response.json()
  }).catch((err) => console.log(err))
}

export {
  exchangePoints,
  myActivity
}