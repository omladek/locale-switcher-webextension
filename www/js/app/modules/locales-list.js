/**
 * copy locale name into the clipboard
 * @param {object} container
 */
var LocalesList = function(container) {
    this.container = container;

    this.container.addEventListener('click', this.handleClickCopy.bind(this));
};

LocalesList.prototype.handleClickCopy = function(e) {
    var current = e.target;

    if (current.classList.contains('copy-locale')) {
        this.handleCopy(e.target.parentNode, current.querySelector('.glyphicon'));
    }
};

LocalesList.prototype.handleCopy = function(target, icon) {
    var localeString = target.querySelector('.js-change-locale').textContent;
    var input = target.querySelector('.input-locale');

    input.value = localeString;

    input.select();

    document.execCommand('Copy', false, null);

    icon.classList.remove('hide');

    setTimeout(function() {
        icon.classList.add('hide');
    }, 1000);
};

module.exports = LocalesList;
