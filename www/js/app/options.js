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
