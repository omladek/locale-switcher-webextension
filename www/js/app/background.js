/*
 * prefill HTTP authentication - the url must be specified in the manifest
 * perminissions also - Firefox currently doesn' t support this
 */
var gPendingCallbacks = [];

chrome.webRequest.onAuthRequired.addListener(handleAuthRequest, {
    urls: [
        'http://*.exmaple.tld/folder/*',
    ]
}, ['asyncBlocking']);

function processPendingCallbacks() {
    var callback = gPendingCallbacks.pop();
    callback({
        authCredentials: {
            username: 'user',
            password: 'psw'
        }
    });
}

function handleAuthRequest(details, callback) {
    gPendingCallbacks.push(callback);
    processPendingCallbacks();
}
