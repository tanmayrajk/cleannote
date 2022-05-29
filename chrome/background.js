let input
const PANTRYID = 'bc3879a8-1b91-4de8-9944-3b431f798331'

async function putBasketContents(pantryID, basket, data = {}) {
    let response = await fetch(`https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/${basket}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json
}

async function postBasketContents(pantryID, basket, data = {}) {
    let response = await fetch(`https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/${basket}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json
}

async function getBasketContents(pantryID, basket) {
    let response = await fetch(`https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/${basket}`)
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }    
    response = await response.json()
    return response
}

chrome.runtime.onInstalled.addListener(() => {
    getBasketContents(PANTRYID, 'betternote').then(response => {
        if (response.input != undefined) input = response.input
        else input = response.input
    })
    .catch(error => {
        postBasketContents(PANTRYID, 'betternote', {}).then(() => {
            input = ''
        })
    })

})

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "betternote")
    port.onDisconnect.addListener(function () {
        putBasketContents(PANTRYID, 'betternote', {input})
    })
})

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "betternote")
    port.onMessage.addListener(function(msg) {
        input = msg
    })
})