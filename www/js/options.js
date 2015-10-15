(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Saves options to chrome.storage.sync.
function save_options() {
    var domainName = document.getElementById('domain-name').value;
    var homepage = document.getElementById('homepage').value;
    chrome.storage.sync.set({
        domainName: domainName,
        homepage: homepage
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options successfully saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores the values using the preferences stored in chrome.storage.
function restore_options() {
    // Use default value
    chrome.storage.sync.get({
        domainName: 'example',
        homepage: 'index.html'
    }, function(items) {
        document.getElementById('domain-name').value = items.domainName;
        document.getElementById('homepage').value = items.homepage;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

},{}]},{},[1])