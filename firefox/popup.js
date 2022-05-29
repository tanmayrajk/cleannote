const PANTRYID = ""

const textareaEl = document.getElementById('inputBox')
const copyBtnEl = document.getElementById('copyBtn')
const exportBtnEl = document.getElementById('exportBtn')
const clearBtnEl = document.getElementById('clearBtn')

let inputText

textareaEl.value = 'loading...'
textareaEl.disabled = true

getBasketContents(PANTRYID, 'betternote')
    .then(response => {
        if (response.input != undefined) {
            inputText = response.input
            textareaEl.value = inputText
            textareaEl.disabled = false
            textareaEl.focus()
        } else {
            inputText = ''
            textareaEl.value = inputText
            textareaEl.disabled = false
            textareaEl.focus
        }
    })
    .catch(error => {
        textareaEl.disabled = true
        textareaEl.value = "Failed to fetch your notes. Check your internet connection or PantryID and open the extension again."
        textareaEl.style.color = '#f5a97f'
    })

async function getBasketContents(pantryID, basket) {
    let response = await fetch(`https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/${basket}`)
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    response = await response.json()
    return response
}

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

let port = browser.runtime.connect({ name: "betternote" })

textareaEl.addEventListener('input', () => {
    inputText = textareaEl.value
    port.postMessage(inputText)
})

copyBtnEl.addEventListener('click', () => {
    var copyText = textareaEl
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    copyBtnEl.innerText = "copied!"
    setTimeout(() => copyBtnEl.innerText = "copy", 1000)

})

exportBtnEl.addEventListener('click', () => {
    let today = new Date()
    let date = today.getDate()
    let month = today.getMonth() + 1
    let year = today.getFullYear()

    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let blob = new Blob([textareaEl.value], { type: "text/plain" })
    url = window.URL.createObjectURL(blob);
    a.href = url
    a.download = `cleannote-export-${date}-${month}-${year}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
})

clearBtnEl.addEventListener('click', () => {
    textareaEl.value = ''
    inputText = textareaEl.value
    port.postMessage(inputText)
    textareaEl.focus()
})