// switching environments, locales, domains
var Switcher = require('./modules/switcher.js');

// call URL via AJAX and reload the current tab
var CallUrl = require('./modules/call-url.js');

var application = document.getElementById('application');
if (application) {
    new Switcher(application);
}

var btnClearCache = document.getElementById('clear-cache');
if (btnClearCache) {
    new CallUrl(btnClearCache);
}