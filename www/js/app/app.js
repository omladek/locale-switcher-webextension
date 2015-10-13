//require('../../bower/bootstrap-stylus/js/tab.js');
// switching environments, locales, domains
var Switcher = require('./modules/switcher.js');

var application = document.getElementById('application');
if (application) {
    new Switcher(application);
}