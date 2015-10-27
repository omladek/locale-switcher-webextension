// switching environments, locales, domains
var Switcher = require('./modules/switcher.js');

// call URL via AJAX and reload the current tab
var CallUrl = require('./modules/call-url.js');

// get page info - pageID, headline
var PageInfo = require('./modules/page-info.js');

// get build status
var BuildStatus = require('./modules/build-status.js');

// tabs
var Tabs = require('./modules/tabs.js');

// copy locale info to clipboard
var LocalesList = require('./modules/locales-list.js');

var application = document.getElementById('application');
if (application) {
    new Switcher(application);
}

var btnClearCache = document.getElementById('clear-cache');
if (btnClearCache) {
    new CallUrl(btnClearCache);
}

new PageInfo();

var btnGetBuildStatus = document.querySelector('a[href="#tab-buildstatus"]');
if (btnGetBuildStatus) {
    new BuildStatus(btnGetBuildStatus);
}

var tabs = document.getElementById('nav-tabs');
if (tabs) {
    new Tabs(tabs);
}

var localesList = document.getElementById('locales-list');
if (localesList) {
    new LocalesList(localesList);
}