/**
 * @param {object} btn
 */
var CallUrl = function(btn) {
    this.btn = btn;

    // retrieve the settings
    this.getSettings();

    // get the current URL which is active
    this.parseCurrentUrl();

    // listen for clicks
    this.btn.addEventListener('click', this.handleCLick.bind(this));
};

CallUrl.prototype.getSettings = function() {
    var that = this;
    // Firefox currently doesn't support options setting.
    // You must put your domain and homepage info here.
    //
    // In Chrome user can change these values in the chrome://extensions/ or in
    // the toolbar when clicking on the icon options menu.
    that.urlCache = 'cacheAdminTool.html?cache=Content&removeCache=true&locale=';
    that.urlCacheMessages = 'cacheAdminTool.html?cache=resourceBundleCache&removeCache=true';
    that.domainName = 'example';

    if (typeof chrome.storage.sync !== 'undefined') {
        chrome.storage.sync.get({
            domainName: that.domainName,
            urlCache: that.urlCache,
            urlCacheMessages: that.urlCacheMessages
        }, function(items) {
            that.domainName = items.domainName;
            that.urlCache = items.urlCache;
            that.urlCacheMessages = items.urlCacheMessages;
        });
    }
};

CallUrl.prototype.parseCurrentUrl = function() {
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

CallUrl.prototype.handleCLick = function(e) {
    e.preventDefault();

    this.btn.classList.add('progress');

    this.clearCache();
    this.clearCacheMessages();
};

CallUrl.prototype.clearCache = function() {
    var url = 'http://' + this.currentEnvironment + '.' + this.domainName + '.' + this.currentTld + '/' + this.currentLocale + '/' + this.urlCache + this.currentLocale;

    this.ajaxClearCacheRunning = true;

    this.makeRequest(url, 'cache');
};

CallUrl.prototype.clearCacheMessages = function() {
    var url = 'http://' + this.currentEnvironment + '.' + this.domainName + '.' + this.currentTld + '/' + this.currentLocale + '/' + this.urlCacheMessages;

    this.ajaxClearCacheMessagesRunning = true;

    this.makeRequest(url, 'messages');
};

/**
 * @param  {string} url
 * @param  {string} callback
 */
CallUrl.prototype.makeRequest = function(url, callback) {
    var that = this;
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {

            if (callback === 'cache') {
                that.ajaxClearCacheMessagesRunning = false;
            } else if (callback === 'messages') {
                that.ajaxClearCacheRunning = false;
            }

            that.checkAjaxRequestStatus();
        }
    };

    xhr.send();
};

CallUrl.prototype.checkAjaxRequestStatus = function() {
    if (!this.ajaxClearCacheRunning && !this.ajaxClearCacheMessagesRunning) {
        this.btn.classList.remove('progress');
        this.reloadTab();
    }
};

CallUrl.prototype.reloadTab = function(e) {
    chrome.tabs.reload();
};

module.exports = CallUrl;
