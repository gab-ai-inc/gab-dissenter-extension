var t={name:"Apple Safari",slug:"safari",scriptVariableMap:{BROWSER:"browser",CONTEXT_MENUS:"menu"},manifestMap:{},version:"0.1.0"},e="chrome",n="firefox",r="edge",i="safari",o="https://dissenter.com/discussion/begin-extension?url=",a=function(t){return!s(t)&&!u(t)&&(null!==t&&"object"==typeof t)},c=function(t){return"string"==typeof t||t instanceof String},u=function(t){return!c(t)&&!s(t)&&null!=t&&null!=t&&(t&&"[object Date]"===Object.prototype.toString.call(t)&&!isNaN(t))},s=function(t){return Array.isArray(t)},f=function(){document.body,document.getElementById("popup");var r=document.getElementById("popup-iframe");function n(t,n){n,setTimeout(function(){var t=encodeURIComponent(n),e=o+t;r.setAttribute("src",e),r.classList.remove("hidden")},250)}this.init=function(){t.slug===i?safari.application.activeBrowserWindow.addEventListener("activate",function(t){if(t.target.hasOwnProperty("url")){t.target.title;n(0,t.target.url||"")}},!0):browser.tabs.query({active:!0,currentWindow:!0},function(t){if(!t)return!1;var e=t[0]||{};browser.tabs.executeScript({code:"try { document.querySelector('link[rel=\"canonical\"]').href; } catch(e) {}"},function(t){e.title;n(0,t[0]||e.url||"")})})}};document.addEventListener("DOMContentLoaded",function(){(new f).init()});