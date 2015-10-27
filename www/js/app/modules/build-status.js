/**
 * @param {object} btn
 */
var BuildStatus = function(btn) {
    this.btn = btn;

    // get the current URL which is active
    this.parseCurrentUrl();

    this.alreadyGenerated = false;

    // listen for clicks
    this.btn.addEventListener('click', this.handleCLick.bind(this));
};

BuildStatus.prototype.parseCurrentUrl = function() {
    var that = this;

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        var url = tabs[0].url;
        var environment = url.split('/')[2].split('.')[0]; // local, dev, stage, www - everything between the protocol and the domain name
        var locale = url.split('/')[3]; // en-gb, de-de - everything between the first pair of slashes after the tld
        var page = url.split('/' + locale + '/')[1]; // index.html, some-folder/some-page.html - everything after the locale
        var tld = (url.split('/')[2].split('.').length > 3) ? url.split('/')[2].split('.')[2] + '.' + url.split('/')[2].split('.')[3] : url.split('/')[2].split('.')[2];

        that.currentEnvironment = environment;
        that.currentLocale = locale;
        that.currentTld = tld;
    });
};

BuildStatus.prototype.handleCLick = function(e) {
    e.preventDefault();

    if (this.alreadyGenerated) {
        return;
    }

    this.getBuildStatus();
};

BuildStatus.prototype.getBuildStatus = function() {
    var url = 'http://' + this.currentEnvironment + '.example.' + this.currentTld + '/example-web/mvc/version';

    this.ajaxRequestRunning = true;

    this.makeRequest(url);
};

/**
 * @param  {string} url
 */
BuildStatus.prototype.makeRequest = function(url) {
    var that = this;
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {

            that.handleSuccess(xhr.responseText);

            that.ajaxRequestRunning = false;

            that.alreadyGenerated = true;
        }
    };

    xhr.send();
};

/**
 * @param  {string} response
 */
BuildStatus.prototype.handleSuccess = function(response) {
    this.placeholder = document.getElementById('js-build-status');
    this.placeholder.innerHTML = response;
    this.buildInfoTable = this.placeholder.getElementsByTagName('table')[0];
    this.buildInfoTable.classList.add('table', 'table-striped', 'table-hover', 'table-condensed', 'table-bordered');

    this.placeholderTable = document.getElementById('js-build-status-table');
    this.placeholderTable.appendChild(this.buildInfoTable.cloneNode(true));

    this.placeholder.innerHTML = '';
};

module.exports = BuildStatus;
