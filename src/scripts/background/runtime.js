/**
 * @description - Create a new background page
 */
__BROWSER__.browserAction.onClicked.addListener(function() {
    __BROWSER__.tabs.create({ url: 'index.html' });
});
