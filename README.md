# Dissenter Browser Extension

This repository holds the Dissenter Browser Extension code that is used to generate the final distribution code per each browser.

For more information, please visit: https://dissenter.com

# • Download the Dissenter Browser Extension

Please visit https://github.com/gab-ai-inc/gab-dissenter-extension/releases to download the extension for your specific browser.

# • Installation

Latest versions:

| Browser | Version |
| --- | --- |
Chrome | v0.1.9 |
Edge | v0.1.8 |
Firefox | v0.1.10 |
Safari | v0.1.7 |

This extension only requires developer dependencies.

Clone or download the repository and then:
`$ npm install`

# • Overview

This is meant to help anyone understand this repository, where everything lives and what everything does.

## • Details

This extension is comprised of a configuration class (`Browser`) and its corresponding extension files. The extension files follow the standard browser extension layout: `manifest`, `popup`, `background`, and other related browser API's to connect them all.

For more information regarding the understanding of how browser extension source code is formatted please visit: https://developer.chrome.com/extensions/getstarted or https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons

Chrome, Firefox, and Microsoft edge share nearly identical browser extension API's. Within the following sections, we'll touch upon shared code and how we use `gulp`, an automation toolkit, to inject the configuration class (`Browser`) specific variables into the code base in order to achieve the final distribution code per each browser.

Safari browser extensions can be created via Extension Builder and by following "Chrome Extension Porting" instructions detailed here: https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/SafariExtensionsConversionGuide/Chapters/Chrome.html.  For the most part however, Safari extensions contain similar code to the previously mentioned browsers.

## • Code

The code is split into the configuration and source folders.

### • Configuration (`./config`)

The configuration files contain the Browser class (`browser.js`), browsers that implement the Browser class (`browsers.js`) and the manifest file (`manifest.js`) that all browser extensions rely on.

The Browser class contains information that the _Build Process_ uses. Aside from `name`, `slug`, `version`, and `path`, the `manifestMap` and `scriptVariableMap` are what we use to customize the source code and manifest.

___
#### • `manifestMap`

The `manifestMap` is an `object` that contains key/value content that is used to inject into the `manifest` file. Within the `gulp:manifest` function, we grab the `./config/manifest.js` file, clone it, convert to JSON then inject the `browser.manifestMap` object into it.

This is necessary because each browser may require seperate key/values or, are simply just named differently.

___
#### • `scriptVariableMap`

The `scriptVariableMap` is an `object` that contains key/value content that is used to define browser specific variables using general variable names.

The existing values that we use are:

| Name | Variable | Definition |
| --- | --- | --- |
`BROWSER` | `__BROWSER__` | Defines the variable for "browser" per browser API requirements
`CONTEXT_MENUS` | `__CONTEXT_MENUS__` | Defines the variable for "context menus" per browser API requirements
`MESSENGER` | `__MESSENGER__` | Defines the variable for "runtime" per browser API requirements

Each of these variables in the `scriptVariableMap` are used within the _Build Process_ to find and replace throughout the code. This enables us to write 1 (one) shared codebase for all of these browser extensions by just writing generic variable names such as `__BROWSER__` and within the `gulp` process, using the `Browser` class, we replace all occurences within each source file.

Example:

```javascript
//Before
__BROWSER__.browserAction.onClicked.addListener(function() {
    // some code here...
});
```

Running the `gulp:scripts` function provides the following output for example:

```javascript
//After
myCustomBrowserVariable.browserAction.onClicked.addListener(function() {
    // some code here...
});
```

### • Source (`./src`)

The source files contain folders for `images`, `scripts`, `styles` and `views`.

___
#### • Images (`./src/images`)

The images are split up between `icons` and `logo`. The images are used within some of the `styles` and `views` files.

___
#### • Scripts (`./src/scripts`)

We're using vanilla `javascript` for these files. We don't use any module bundlers anything for this other than `uglifcation`.
The scripts are seperated between `background`, `components` and `utils`.

| Folder | Files | Usage |
| --- | --- | --- |
`background` | Contains files used for the background
`components` | Contains `popup.js`
`utils` | Contains shared code helpers

The scripts are split up during the build process between: `background.js`, `popup.js`. Each of those files do not contain each other but, they do however contain all of the `util` directory files.

___
#### • Styles (`./src/styles`)

We use `scss` for our styles.

The style files are split up using a standard `scss` organizational structure of `components`, `modules`, and `partials`.
During the build process each of the components (currently only: `popup.scss`) contain all of the `modules` and `partials` styles. The components do not share code between themselves.

___
#### • Views (`./src/views`)

We use `pug` (https://pugjs.org) for each of the `views` files.

| File | Usage |
| --- | --- |
`background.pug` | Simple file that just includes the final `background.js` script.
`popup.pug` | The primary file that contains the functionality display the Dissenter.com iframe.


# • Build Process

The build process uses each `Browser` class object defined in `./config/browsers.js` to automatically build `scripts`, `styles`, `html`, `manifest` and `images` into the `./build` directory (_hidden_). The gulp scripts compile, minify (& mangle) and save the combined files in these `./build` directories.

Each of those scripts can be run using npm.

For example:

```
$ npm run gulp:scripts
$ npm run gulp:styles
$ npm run gulp:html
$ npm run gulp:manifest
$ npm run gulp:images
```

You can also run all of them at once using the gulp `build` function:

```
$ npm run build
```

During the build process, all of the code in the `./src` directory is compiled into the `./build` directory. The `./build` directory will contain folders named after each of the `Browser` class `slug` (`browser.slug` ... i.e. `chrome`, `firefox`, etc.). Each of the folders contain browser specific extension code formatted in a specific way that is read by the main `manifest.json` in each of the folder's directories. For example, the `popup`, `images`, `background` and other related `manifest.json` keys are transfered from the `./src` directory into the `./build/*` folders.
