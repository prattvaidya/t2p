const create = (user) => {
  return fetch('/api/users/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then((response) => {
      return response.json()
    }).catch((err) => console.log(err))
}

const list = () => {
  return fetch('/api/users/', {
    method: 'GET',
  }).then(response => {
    return response.json()
  }).catch((err) => console.log(err))
}

const read = (params, credentials) => {
  return fetch('/api/users/' + params.userId, {
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

const update = (params, credentials, user) => {
  return fetch('/api/users/' + params.userId, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: user
  }).then((response) => {
    return response.json()
  }).catch((err) => {
    console.log(err)
  })
}

const remove = (params, credentials) => {
  return fetch('/api/users/' + params.userId, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    }
  }).then((response) => {
    return response.json()
  }).catch((err) => console.log(err))
}

const registerPartner = (params, credentials, partnerId) => {
  return fetch('/api/users/registerPartner/' + partnerId, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: JSON.stringify({userId:params.userId, partnerId: partnerId})
  }).then((response) => {
    return response.json()
  }).catch((err) => {
    console.log(err)
  })
}

const unregisterPartner = (params, credentials, partnerId) => {
  return fetch('/api/users/unregisterPartner/' + partnerId, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: JSON.stringify({userId:params.userId, partnerId: partnerId})
  }).then((response) => {
    return response.json()
  }).catch((err) => {
    console.log(err)
  })
}

const findPartners = (params, credentials) => {
  return fetch('/api/users/findPartners/' + params.userId, {
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

const myPartners = (params, credentials) => {
  return fetch('/api/users/myPartners/' + params.userId, {
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
  create,
  list,
  read,
  update,
  remove,
  registerPartner,
  unregisterPartner,
  findPartners,
  myPartners
}
