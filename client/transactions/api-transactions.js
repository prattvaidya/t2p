const exchangePoints = (info) => {
    return fetch('/api/exchange/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
      })
      .then((response) => {
        return response.json()
      }).catch((err) => console.log(err))
  }

  export {
    exchangePoints
  }