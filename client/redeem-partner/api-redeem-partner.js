const list = (credentials) => {
    return fetch('/api/redeem-partners/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        }
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err))
}

const create = (redeemPartner, credentials) => {
    return fetch('/api/redeem-partners/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(redeemPartner)
    })
        .then((response) => {
            return response.json()
        }).catch((err) => console.log(err))
}

export {
    list,
    create
}