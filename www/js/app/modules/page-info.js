/**
 * Module for getting the pageID and headline - this info is generated by the CMS
 * and it is rendered in the source code of the page inside a HTML comment.
 *
 * We retrieve this info and put it into input fields so user can copy it.
 */
var PageInfo = function() {
    this.inputPageId = document.getElementById('page-id');
    this.inputPageInfo = document.getElementById('page-info');
    this.btnCopyPageId = document.getElementById('copy-page-id');
    this.btnCopyPageInfo = document.getElementById('copy-page-info');

    this.getPageInfo();

    this.btnCopyPageId.addEventListener('click', this.handleClickCopy.bind(this));
    this.btnCopyPageInfo.addEventListener('click', this.handleClickCopy.bind(this));
};

PageInfo.prototype.getPageInfo = function() {
    var that = this;

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        var pageSourceLower = message.content.toLowerCase();
        var pageSource = message.content;
        var url = message.url;
        var pageId = pageSourceLower.search('pageid'); // number of characters when pageId is beginning
        var pageIdInteger = pageSource.slice(pageId + 8).substring(0, 4);
        var headline;

        if (message.meta1 === ' HTML5 ') {
            headline = message.meta2.split(/\r?\n/)[5].slice(10);
        } else {
            headline = message.meta1.split(/\r?\n/)[5].slice(10);
        }

        if (isNaN(pageIdInteger)) {
            pageIdInteger = '';
            that.inputPageInfo.value = url;
        } else {
            that.inputPageInfo.value = 'pageID: ' + pageIdInteger + ' - ' + headline + ' - ' + url;
        }

        that.inputPageId.value = pageIdInteger;
    })

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            //firefox doesn't support chrome.extension.sendRequest - https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Chrome_incompatibilities
            //code: 'chrome.extension.sendRequest({content: document.body.innerHTML, meta1: document.childNodes[1].textContent, meta2: document.childNodes[2].textContent, url: window.location.href}, function(response) { });'
            code: 'chrome.runtime.sendMessage({content: document.body.innerHTML, meta1: document.childNodes[1].textContent, meta2: document.childNodes[2].textContent, url: window.location.href}, function(response) { });'
        });
    });
};

PageInfo.prototype.handleClickCopy = function(e) {
    var current = e.target;

    if (current.id === 'copy-page-id') {
        this.handleCopy(this.inputPageId, this.btnCopyPageId.querySelector('.glyphicon'));
    } else if (current.id === 'copy-page-info') {
        this.handleCopy(this.inputPageInfo, this.btnCopyPageInfo.querySelector('.glyphicon'));
    }
};

PageInfo.prototype.handleCopy = function(target, icon) {
    target.select();

    document.execCommand('Copy', false, null);

    icon.classList.remove('hide');

    setTimeout(function() {
        icon.classList.add('hide');
    }, 1000);
};

module.exports = PageInfo;
