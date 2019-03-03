//Modules
const gulp = require('gulp');
const fs = require('fs');

//Config
const Browsers = require('./config/browsers');
const manifest = require('./config/manifest');


//

/**
 * @description - Helper to set value in object with path
 */
function setObjectValueWithPath(object, path, value) {
  let keys = path.split('.');
  let last = keys.pop();

  keys.reduce(function(o, k) {
    return o[k] = o[k] || {};
  }, object)[last] = value;
};


/**
 * @description - Create gulp task 'styles'
 */
gulp.task('styles', function () {
  //Modules
  const sass = require('gulp-sass');
  const cleanCSS = require('gulp-clean-css');
  const sourcemaps = require('gulp-sourcemaps');
  const concat = require('gulp-concat');
  const gulpif = require('gulp-if');
  const postcss = require('gulp-postcss');
  const autoprefixer = require('autoprefixer');
  const wait = require('gulp-wait');

  function getPromise(fileName, savePath) {
    return new Promise((resolve, reject) => {
      gulp
        .src([
          'src/styles/index.scss',
          `src/styles/components/${fileName}.scss`,
        ])
        .pipe(wait(500))
        .pipe(concat(`${fileName}.css`))
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${savePath}/${fileName}`))
        .on('error', err => {
          reject(err);
        }).on('end', () => {
        resolve();
      });
    });
  };

  let promises = [];

  for (let i = 0; i < Browsers.length; i++) {
    let browser = Browsers[i];

    promises.push(getPromise('popup', browser.path));
    if(browser.slug === 'firefox'){
      promises.push(getPromise('sidebar', browser.path));
    }
  };

  return Promise.all(promises);
});

/**
 * @description - Create gulp task 'images'
 */
gulp.task('images', () => {
  let promises = [];

  for (let i = 0; i < Browsers.length; i++) {
    let browser = Browsers[i];

    let path = `${browser.path}/assets/images`;

    let promise = new Promise((resolve, reject) => {
      gulp
        .src(['src/images/**/**'])
        .pipe(gulp.dest(path))
        .on('error', err => {
          reject(err);
        }).on('end', () => {
        resolve();
      });
    });

    promises.push(promise);
  };

  return Promise.all(promises);
});

/**
 * @description - Create gulp task 'scripts'
 */
gulp.task('scripts', () => {
  const concat = require('gulp-concat');
  const uglify = require('gulp-uglify');
  const replace = require('gulp-replace');
  const insert = require('gulp-insert');

  function getPromise(fileName, findPath, browser, pathSuffix) {
    let browserConfig = JSON.stringify(browser);
    let savePath = browser.path;
    if (pathSuffix) savePath += `/${pathSuffix}`;

    return new Promise((resolve, reject) => {
      gulp
        .src(
          [
            'src/scripts/utils/**',
            findPath,
          ]
        )
        .pipe(concat(`${fileName}.js`))
        .pipe(insert.prepend(`var BROWSER_CONFIG = ${browserConfig};`))
        .pipe(replace('__BROWSER__', browser.scriptVariableMap.BROWSER))
        .pipe(replace('__CONTEXT_MENUS__', browser.scriptVariableMap.CONTEXT_MENUS))
        .pipe(uglify({
          mangle: {
            toplevel: true,
          },
        }))
        .pipe(gulp.dest(`${savePath}/${fileName}`))
        .on('error', err => {
          reject(err);
        }).on('end', () => {
        resolve();
      });
    });
  };

  let promises = [];

  for (let i = 0; i < Browsers.length; i++) {
    let browser = Browsers[i];

    promises.push(getPromise('popup', 'src/scripts/components/popup.js', browser));
    if (browser.slug !== 'safari') promises.push(getPromise('background', 'src/scripts/background/**', browser));

    if(browser.slug === 'firefox'){
      promises.push(getPromise('sidebar', 'src/scripts/components/sidebar.js', browser));
    }

  };

  return Promise.all(promises);
});

/**
 * @description - Create gulp task 'manifest'
 */
gulp.task('manifest', () => {
  let promises = [];

  for (let i = 0; i < Browsers.length; i++) {
    let browser = Browsers[i];

    let path = `${browser.path}`;

    if (browser.slug === 'safari') {
      let promise = new Promise(function(resolve, reject) {
        fs.readFile(`./config/Info.plist`, function(err, data) {
          if (err) reject(err);
          else {
            fs.writeFile(`${path}/Info.plist`, data, function(err) {
              if (err) reject(err);
              else resolve();
            });
          }
        });
      });

      promises.push(promise);
    }

    if(browser.slug === 'firefox') {
      //Get manifest and input browser keys
      let str = JSON.stringify(manifest);
      str = str.replace(/__CONTEXT_MENUS__/g, browser.scriptVariableMap.CONTEXT_MENUS);

      let thisManifest = JSON.parse(str);

      for (let key in browser.manifestMap) {
        let value = browser.manifestMap[key];
        setObjectValueWithPath(thisManifest, key, value);
      };

      let promise = new Promise(function(resolve, reject) {
        fs.writeFile(`${path}/manifest.json`, JSON.stringify(thisManifest), function(err) {
          if (err) reject(err);
          else resolve();
        });
      });

      promises.push(promise);
    }

    else {
      //Get manifest and input browser keys
      let str = JSON.stringify(manifest);
      str = str.replace(/__CONTEXT_MENUS__/g, browser.scriptVariableMap.CONTEXT_MENUS);

      let thisManifest = JSON.parse(str);

      // removing FF only sidebar from manifest
      delete thisManifest.sidebar_action;


      for (let key in browser.manifestMap) {
        let value = browser.manifestMap[key];
        setObjectValueWithPath(thisManifest, key, value);
      };

      let promise = new Promise(function(resolve, reject) {
        fs.writeFile(`${path}/manifest.json`, JSON.stringify(thisManifest), function(err) {
          if (err) reject(err);
          else resolve();
        });
      });

      promises.push(promise);
    }




  };

  return Promise.all(promises);
});

/**
 * @description - Create gulp task 'html'
 */
gulp.task('html', () => {
  const pug = require('gulp-pug');
  const replace = require('gulp-replace');

  function getPromise(fileName, browser) {
    return new Promise((resolve, reject) => {
      gulp
        .src(`src/views/${fileName}.pug`)
        .pipe(replace('__BROWSER_NAME__', browser.name))
        .pipe(replace('__VERSION__', browser.version))
        .pipe(pug({
          name: `${fileName}.html`,
          verbose: true,
        }))
        .pipe(gulp.dest(`${browser.path}/${fileName}`))
        .on('error', err => {
          reject(err);
        }).on('end', () => {
        resolve();
      });
    });
  }

  let promises = [];

  for (let i = 0; i < Browsers.length; i++) {
    let browser = Browsers[i];

    promises.push(getPromise('popup', browser));
    if (browser.slug !== 'safari') promises.push(getPromise('background', browser));

    if(browser.slug === 'firefox'){
      promises.push(getPromise('sidebar', browser));
    }


  };

  return Promise.all(promises);
});


/**
 * @description - Create gulp task 'build' to combine ('images', 'styles', 'scripts', 'manifest', 'html')
 */
gulp.task('build', gulp.series('images', 'styles', 'scripts', 'manifest', 'html'));
