/**
 * @param {object} container
 */
var Tabs = function(container) {
    this.container = container;

    this.container.addEventListener('click', this.handleCLick.bind(this));
};

Tabs.prototype.handleCLick = function(e) {
    var current = e.target;

    if (current.getAttribute('data-toggle') === 'tab') {
        this.showTab(e);
    }
};

Tabs.prototype.showTab = function(e) {
    var current = e.target.href.split('#')[1];

    document.querySelector('.tab-pane.active').classList.remove('active');
    document.querySelector('#' + current).classList.add('active');

    this.container.querySelector('li.active').classList.remove('active');
    e.target.parentNode.classList.add('active');
};

module.exports = Tabs;