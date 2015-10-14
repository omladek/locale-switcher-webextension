/**
 * @param {object} container
 */
var Switcher = function(container) {
    this.container = container;
    this.localesList = document.getElementById('locales-list');
    this.currentUrlInput = document.getElementById('current-url');
    this.domainName = 'example'; // TODO - move to some configuration
    this.homepage = 'index.html'; // TODO - move to some configuration
    this.openNewTabCheckbox = document.getElementById('new-tab');
    this.openHomepageCheckbox = document.getElementById('homepage');

    this.parseCurrentUrl();

    this.container.addEventListener('click', this.handleCLick.bind(this));
};

Switcher.prototype.handleCLick = function(e) {
    var current = e.target;

    if (current.classList.contains('js-change-locale')) {
        this.handleLocaleChange(e);
    } else if (current.classList.contains('js-change-environment')) {
        this.handleEnvironmentChange(e);
    } else {
        // TODO ?
    }
};

Switcher.prototype.openNewTab = function() {
    return this.openNewTabCheckbox.checked;
};

Switcher.prototype.openHomepage = function() {
    return this.openHomepageCheckbox.checked;
};

Switcher.prototype.handleLocaleChange = function(e) {
    e.preventDefault();

    var current = e.target;
    var tld = current.getAttribute('data-tab-tld');
    var page = this.openHomepage() ? this.homepage : this.getCurrentPage();

    this.currentLocale = current.getAttribute('data-tab-locale');

    this.unhighlightLocales();

    this.highlightLocale(this.currentLocale);

    if (this.openNewTab()) {
        this.openPage(this.currentEnvironment, tld, this.currentLocale, page);
    } else {
        this.changeLocation(this.currentEnvironment, tld, this.currentLocale, page);
    }

};

Switcher.prototype.unhighlightLocales = function() {
    this.localesList.querySelector('.active').classList.remove('active');
};

Switcher.prototype.handleEnvironmentChange = function(e) {
    e.preventDefault();

    var current = e.target;
    var tld = this.localesList.querySelector('.active .js-change-locale').getAttribute('data-tab-tld');
    var page = this.openHomepage() ? this.homepage : this.getCurrentPage();

    this.currentEnvironment = current.getAttribute('data-environment');

    this.unhighlightEnvironments();

    this.highlightEnvironment(this.currentEnvironment);

    if (this.openNewTab()) {
        this.openPage(this.currentEnvironment, tld, this.currentLocale, page);
    } else {
        this.changeLocation(this.currentEnvironment, tld, this.currentLocale, page);
    }
};

Switcher.prototype.unhighlightEnvironments = function() {
    this.container.querySelector('.js-change-environment.btn-primary').classList.remove('btn-primary');
};

Switcher.prototype.getCurrentPage = function() {
    return this.currentUrlInput.value;
};

Switcher.prototype.changeLocation = function(environment, tld, locale, page) {
    chrome.tabs.update({
      'url': 'http://' + environment + '.' + this.domainName + '.' + tld + '/' + locale + '/' + page, 'active' : true
    });
};

Switcher.prototype.openPage = function(environment, tld, locale, page) {
    chrome.tabs.create({
      'url': 'http://' + environment + '.' + this.domainName + '.' + tld + '/' + locale + '/' + page, 'active' : true
    });
};

Switcher.prototype.parseCurrentUrl = function() {
    var that = this;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url;
        var environment = url.split('/')[2].split('.')[0]; // local, dev, stage, www - everything between the protocol and the domain name
        var locale = url.split('/')[3]; // en-gb, de-de - everything between the first pair of slashes after the tld
        var page = url.split('/' + locale + '/')[1]; // index.html, some-folder/some-page.html - everything after the locale

        that.currentUrlInput.value = url.split('/' + locale + '/')[1]; // helper for development - save the url to the input

        that.highlightEnvironment(environment);
        that.currentEnvironment = environment;

        that.highlightLocale(locale);
        that.currentLocale = locale;

        that.scrollToCurrentLocale();

        that.currentPage = page;
    });
};

Switcher.prototype.highlightLocale = function(locale) {
    this.localesList.querySelector('.js-change-locale[data-tab-locale="' + locale + '"]').parentNode.classList.add('active');
};

Switcher.prototype.highlightEnvironment = function(environment) {
    this.container.querySelector('.js-change-environment[data-environment="' + environment + '"]').classList.add('btn-primary');
};

// not working in Firefox
Switcher.prototype.scrollToCurrentLocale = function() {
    var element = this.localesList.querySelector('.active');
    var offset = element.getBoundingClientRect().top;

    window.scroll(0, offset - 220); // 200 is the fixed header height
};

module.exports = Switcher;