// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/keys.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.key = void 0;
const key = '4f27d39e191ab6285b0ab1209ca4435a';
exports.key = key;
},{}],"js/app.js":[function(require,module,exports) {
"use strict";

var _keys = require("./keys.js");

const get = 'https://api.themoviedb.org/3';
const genresUrl = `${get}/genre/movie/list?api_key=${_keys.key}`;
const popularUrl = `${get}/movie/popular?api_key=${_keys.key}`;
const upcomingUrl = `${get}/movie/upcoming?api_key=${_keys.key}`;
const nowPlayingUrl = `${get}/movie/now_playing?api_key=${_keys.key}`;
const imageUrl = 'https://image.tmdb.org/t/p/w780';
const body = document.querySelector('body');
const moviesList = document.querySelector('.moviesList');
const mainNav = document.querySelectorAll('.mainNav ul li');
const sectionTitle = document.querySelector('.sectionTitle h4');
const loadMoreButton = document.querySelector('.loadMore');
const favePanelButton = document.querySelector('.favePanel');
const movieHighlight = document.querySelector('.movieHighlight');
const faveMoviesPanel = document.querySelector('.faveMoviesPanel');
const posterBig = document.querySelector('.poster img');
const movieTitle = document.querySelector('.movieInfo h1');
const movieOverview = document.querySelector('.overview');
const genreTags = document.querySelector('.tags');
const prevMovie = document.querySelector('.prevMovie');
const nextMovie = document.querySelector('.nextMovie');
const prevMovieTitle = document.querySelector('.prevMovie h5');
const nextMovieTitle = document.querySelector('.nextMovie h5');
const modalClose = document.querySelector('.card .close');
const saveFaveButton = document.querySelector('.saveFave');
const removeFaveButton = document.querySelector('.removeFave');
const removeAllbutton = document.querySelector('.removeAll');
const faveMoviesList = document.querySelector('.faveMoviesList');
const faveSection = document.querySelector('.faveSection');
const closeFave = document.querySelector('.closeFave');
const noFaveInfo = document.querySelector('.noFave');
const loadMoreSection = document.querySelector('.loadMoreSection');
const loadMoreSectionButton = document.querySelector('.loadMoreSection button');
const sortDescButton = document.querySelector('.sortDesc');
const sortAscButton = document.querySelector('.sortAsc');
const clearSortingButton = document.querySelector('.clearSorting');
let genresArr = [];
let popularArr = [];
let upcomingArr = [];
let nowPlayingArr = [];
let tempPopularArr = [];
let tempUpcomingArr = [];
let tempNowPlayingArr = [];
let tempSorted = [];
let curentView = popularArr;
let movieIndex; //////////////////////////
// Initial data fetch // Just one time at the begining!
//////////////////////////

async function fetchDataOnStart() {
  //
  // Fetch Genres
  //
  try {
    let genresResponse = await fetch(genresUrl);
    let json = await genresResponse.json();
    genresArr.push(...json.genres);
  } catch (err) {
    console.log(err);
  } //
  // Fetch all other Data
  //


  let popularRes = fetch(popularUrl).then(res => res.json());
  let upcomingRes = fetch(upcomingUrl).then(res => res.json());
  let nowPlayingRes = fetch(nowPlayingUrl).then(res => res.json());
  await Promise.all([popularRes, upcomingRes, nowPlayingRes]).then(data => {
    let [popular, upcoming, nowPlaying] = data; //
    // Add genres arrey as strings
    //

    data.forEach(dataGroup => {
      dataGroup.results.map(el => {
        let genres = [];
        el.genre_ids.map(el2 => {
          let genere = genresArr.filter(id => el2 === id.id);
          genres.push(genere[0].name);
        });
        el.genres = genres;
        el.favorite = false;
      });
    }); //
    // Push the data to an Array
    //

    popularArr.push(...popular.results);
    upcomingArr.push(...upcoming.results);
    nowPlayingArr.push(...nowPlaying.results); //////////////////////////
    // REMOVE - JUST FOR TEST
    //////////////////////////

    createList(popularArr);
  });
}

fetchDataOnStart(); //////////////////////////
// Fetch Next Page
//////////////////////////

function fetchMoreData(url) {
  let pagesCount = 2;
  let totalFull = false;
  return async function getData() {
    if (!totalFull) {
      let respons = await fetch(`${url}&page=${pagesCount}`);
      let json = await respons.json();
      pagesCount < json.total_pages ? pagesCount += 1 : totalFull = true; //
      // Add genres arrey as strings
      //

      json.results.map(el => {
        let genres = [];
        el.genre_ids.map(el2 => {
          let genere = genresArr.filter(id => el2 === id.id);
          genres.push(genere[0].name);
        });
        el.genres = genres;
        el.favorite = false;
      }); //
      // Push to an Array based on Url
      //

      tempPopularArr = [];
      tempUpcomingArr = [];
      tempNowPlayingArr = [];

      switch (url) {
        case popularUrl:
          tempPopularArr.push(...json.results);
          createList(tempPopularArr);
          popularArr.push(...json.results);
          curentView = popularArr;
          break;

        case upcomingUrl:
          tempUpcomingArr.push(...json.results);
          createList(tempUpcomingArr);
          upcomingArr.push(...json.results);
          curentView = upcomingArr;
          break;

        case nowPlayingUrl:
          tempNowPlayingArr.push(...json.results);
          createList(tempNowPlayingArr);
          nowPlayingArr.push(...json.results);
          curentView = nowPlayingArr;
          break;

        default:
          alert('No URL');
      }
    }
  };
} //////////////////////////
// Buil DOM List elements
//////////////////////////


function createList(data) {
  data.forEach(movie => {
    let movieCard = document.createElement('li');
    moviesList.appendChild(movieCard);
    movieCard.addEventListener('click', selectedMovieFn);
    let movieName = document.createElement('h5');
    movieCard.appendChild(movieName);
    movieName.textContent = movie.title;
    let movieImg = document.createElement('img');
    movieCard.appendChild(movieImg);

    function setAttributes(el, attrs) {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    }

    if (`${imageUrl}${movie.poster_path}` === 'https://image.tmdb.org/t/p/w780null') {
      setAttributes(movieImg, {
        "src": 'http://samodrole.com/projects/amos/images/noImage.png',
        "height": "140px",
        "width": "90px",
        "alt": ''
      });
    } else {
      setAttributes(movieImg, {
        "src": `${imageUrl}${movie.poster_path}`,
        "height": "140px",
        "width": "90px",
        "alt": `${movie.title}`
      });
    }

    let delay = Math.floor(Math.random() * (120 - 60) + 60);
    setTimeout(addActive, delay);

    function addActive() {
      movieCard.classList.add('active');
    }
  });
  loadMoreSection.hidden = false;
  loadMoreSectionButton.hidden = false;
} ////////////////////////////////////////
// Remove elements from the DOM
////////////////////////////////////////


function removeDOMFn(location) {
  let childList = location.lastElementChild;

  while (childList) {
    location.removeChild(childList);
    childList = location.lastElementChild;
  }
} //////////////////////////
// REBuil DOM List elements based on filter, search, or sort
//////////////////////////


function reCreateList(data) {
  removeDOMFn(moviesList);
  data.forEach(movie => {
    let movieCard = document.createElement('li');
    moviesList.appendChild(movieCard);
    movieCard.addEventListener('click', selectedMovieFn);
    let movieName = document.createElement('h5');
    movieCard.appendChild(movieName);
    movieName.textContent = movie.title;
    let movieImg = document.createElement('img');
    movieCard.appendChild(movieImg);

    function setAttributes(el, attrs) {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    }

    if (`${imageUrl}${movie.poster_path}` === 'https://image.tmdb.org/t/p/w780null') {
      setAttributes(movieImg, {
        "src": 'http://samodrole.com/projects/amos/images/noImage.png',
        "height": "140px",
        "width": "90px",
        "alt": ''
      });
    } else {
      setAttributes(movieImg, {
        "src": `${imageUrl}${movie.poster_path}`,
        "height": "140px",
        "width": "90px",
        "alt": `${movie.title}`
      });
    }

    let delay = Math.floor(Math.random() * (120 - 60) + 60);
    setTimeout(addActive, delay);

    function addActive() {
      movieCard.classList.add('active');
    }
  });
  loadMoreSection.hidden = false;
  loadMoreSectionButton.hidden = false;
} //////////////////////////
// Sort elements
//////////////////////////


function sortFn(direction, key, curentView) {
  tempSorted = 0;
  tempSorted = [...curentView];

  if (direction === 'desc') {
    tempSorted = tempSorted.sort((a, b) => a[key] < b[key] ? 1 : -1);
    reCreateList(tempSorted);
  } else {
    tempSorted = tempSorted.sort((a, b) => a[key] < b[key] ? -1 : 1);
    reCreateList(tempSorted);
  }
} //////////////////////////
// Reste nav Selection
//////////////////////////


function resetNav(element) {
  mainNav.forEach(li => {
    let aLink = li.querySelector('a');
    aLink.classList.remove('active');
  });
  element.target.classList.add('active');
} //////////////////////////
// Switch between sections
//////////////////////////


mainNav.forEach(li => {
  li.addEventListener('click', element => {
    let elName = element.target.dataset.navlink;

    switch (elName) {
      case 'popular':
        removeDOMFn(moviesList);
        createList(popularArr);
        sectionTitle.textContent = 'Popular movies';
        loadMoreButton.dataset.section = 'popular';
        curentView = popularArr;
        resetNav(element);
        resetSorting();
        break;

      case 'upcoming':
        removeDOMFn(moviesList);
        createList(upcomingArr);
        sectionTitle.textContent = 'Upcoming movies';
        loadMoreButton.dataset.section = 'upcoming';
        curentView = upcomingArr;
        resetNav(element);
        resetSorting();
        break;

      case 'nowplaying':
        removeDOMFn(moviesList);
        createList(nowPlayingArr);
        sectionTitle.textContent = 'Now playing movies';
        loadMoreButton.dataset.section = 'nowplaying';
        curentView = nowPlayingArr;
        resetNav(element);
        resetSorting();
        break;

      default:
    }
  });
}); //////////////////////////
// Selected Card info
//////////////////////////

function selectedMovieFn(event) {
  let movieTitle = event.currentTarget.querySelector('h5').textContent;
  movieIndex = curentView.findIndex(movie => {
    return movie.original_title === movieTitle;
  });
  openModal();
} //////////////////////////
// Movie Modal function visible
//////////////////////////


function openModal() {
  const scrollY = window.scrollY;
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;

  if (`${imageUrl}${curentView[movieIndex].poster_path}` === 'https://image.tmdb.org/t/p/w780null') {
    posterBig.setAttribute('src', 'http://samodrole.com/projects/amos/images/noImage.png');
  } else {
    posterBig.setAttribute('src', `${imageUrl}${curentView[movieIndex].poster_path}`);
    posterBig.setAttribute('alt', `${curentView[movieIndex].title}`);
  }

  movieTitle.innerHTML = `${curentView[movieIndex].title} <span>(${curentView[movieIndex].release_date.split('-')[0]})</span>`;
  movieOverview.textContent = curentView[movieIndex].overview;
  genreTags.textContent = curentView[movieIndex].genres.join(' / ');
  isFave(); // console.log(movieIndex)
  // console.log(curentView.length - 1)

  if (movieIndex > 0 && movieIndex < curentView.length) {
    prevMovieTitle.textContent = curentView[movieIndex - 1].title;
    nextMovieTitle.textContent = curentView[movieIndex + 1].title;
    prevMovie.hidden = false;
    nextMovie.hidden = false;
  } else if (movieIndex === 0) {
    nextMovieTitle.textContent = curentView[movieIndex + 1].title;
    prevMovie.hidden = true;
  } else if (movieIndex === curentView.length) {
    prevMovieTitle.textContent = curentView[movieIndex - 1].title;
    nextMovie.hidden = true;
  } else {
    prevMovie.hidden = true;
    nextMovie.hidden = true;
  }

  movieHighlight.classList.add('active');
} //////////////////////////
// Movie Modal close
//////////////////////////


function closeModal() {
  const scrollY = body.style.top;
  body.style.position = '';
  body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
  movieHighlight.classList.remove('active');
  removeDOMFn(genreTags);
  posterBig.setAttribute('src', '');
  posterBig.setAttribute('alt', '');
  movieTitle.innerHTML = '';
  movieOverview.textContent = '';
  movieIndex = '';
} //////////////////////////
// Save Favorite movie
//////////////////////////


function saveFaveMovie() {
  let storedData = storedFave();

  if (storedData === null) {
    storedData = new Array();
  }

  storedData.unshift(curentView[movieIndex]);
  localStorage.setItem(`faveMovies`, JSON.stringify(storedData));
  isFave();
} //////////////////////////
// Get Favorite movies
//////////////////////////


function storedFave() {
  let myFave = localStorage.getItem('faveMovies');
  return JSON.parse(myFave);
} //////////////////////////
// Remove All Favorite movie
//////////////////////////


function removeAllFaveMovie() {
  localStorage.removeItem('faveMovies');
  removeDOMFn(faveMoviesList);
  constructFaveList();
} //////////////////////////
// Remove From Fave
//////////////////////////


function removeFaveMovie(element) {
  let storedData = storedFave();
  let title = element.target.closest('.movieInfoData').querySelector('.title').textContent;
  const regex = /[ (]\d{4}[)]/gm;
  let titleClean = title.replace(regex, '').toString();
  storedData.map(movie => {
    if (movie.title.trim() === titleClean.trim()) {
      let movieIndex = storedData.indexOf(movie);
      storedData.splice(movieIndex, 1);

      if (storedData.length === 0) {
        localStorage.removeItem('faveMovies');
        constructFaveList();
        isFave();
      } else {
        localStorage.setItem(`faveMovies`, JSON.stringify(storedData));
        removeDOMFn(faveMoviesList);
        constructFaveList();
        isFave();
      }
    }
  });
} //////////////////////////
// Create a Fave list
//////////////////////////


function constructFaveList() {
  let storedData = storedFave();
  removeDOMFn(faveMoviesList);

  if (storedData === null || storedData.length === 0) {
    noFaveInfo.hidden = false;
    removeAllbutton.hidden = true;
  } else {
    noFaveInfo.hidden = true;
    removeAllbutton.hidden = false;
    storedData.forEach(movie => {
      let li = document.createElement('li');
      faveMoviesList.appendChild(li);
      li.innerHTML = `<div class='movieInfoData'><img src='${imageUrl}${movie.poster_path}'> <h5 class='title'>${movie.title} <span>(${movie.release_date.split('-')[0]})</span></h5><button><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zm2-8h6v8H5v-8zm5-6H6L5 5H2v2h12V5h-3z"/></svg></button></div>`;
      const removeMovie = li.querySelector('button');
      removeMovie.addEventListener('click', removeFaveMovie);
    });
  }
} //////////////////////////
// Check if movie is Fave
//////////////////////////


function isFave() {
  let storedData = storedFave();
  saveFaveButton.hidden = false;
  removeFaveButton.hidden = true;

  if (storedData) {
    storedData.some(movie => {
      if (movie.title === curentView[movieIndex].title) {
        removeFaveButton.hidden = false;
        saveFaveButton.hidden = true;
      }
    });
  }
} //////////////////////////
// EventListeners && Functions
//////////////////////////


let popularMoviesData = fetchMoreData(popularUrl);
let upcomingMoviesData = fetchMoreData(upcomingUrl);
let nowPlayingMoviesData = fetchMoreData(nowPlayingUrl);
loadMoreButton.addEventListener('click', () => {
  let activeSection = loadMoreButton.dataset.section;

  switch (activeSection) {
    case 'popular':
      popularMoviesData();
      break;

    case 'upcoming':
      upcomingMoviesData();
      break;

    case 'nowplaying':
      nowPlayingMoviesData();
      break;

    default:
  }
});
sortDescButton.addEventListener('click', () => {
  sortFn('desc', 'original_title', curentView);
  sortAscButton.classList.remove('active');
  sortDescButton.classList.add('active');
  clearSortingButton.classList.remove('active');
});
sortAscButton.addEventListener('click', () => {
  sortFn('asc', 'original_title', curentView);
  sortAscButton.classList.add('active');
  sortDescButton.classList.remove('active');
  clearSortingButton.classList.remove('active');
});

function resetSorting() {
  reCreateList(curentView);
  sortAscButton.classList.remove('active');
  sortDescButton.classList.remove('active');
  clearSortingButton.classList.add('active');
}

clearSortingButton.addEventListener('click', resetSorting);
favePanelButton.addEventListener('click', () => {
  faveSection.classList.toggle('active');
  const scrollY = window.scrollY;
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  storedFave();
  constructFaveList();
});
closeFave.addEventListener('click', () => {
  faveSection.classList.toggle('active');
  const scrollY = body.style.top;
  body.style.position = '';
  body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
});
modalClose.addEventListener('click', closeModal);
saveFaveButton.addEventListener('click', saveFaveMovie);
removeAllbutton.addEventListener('click', removeAllFaveMovie);
removeFaveButton.addEventListener('click', removeFaveMovie);
nextMovie.addEventListener('click', () => {
  removeDOMFn(genreTags);
  movieIndex += 1;
  openModal();
  event.stopPropagation();
});
prevMovie.addEventListener('click', () => {
  removeDOMFn(genreTags);
  movieIndex -= 1;
  openModal();
  event.stopPropagation();
});
},{"./keys.js":"js/keys.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64964" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=/app.c3f9f951.js.map