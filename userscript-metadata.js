const packageData = require("./package.json");
console.log(
  `// ==UserScript==
// @name         mangadex-post-to-myanimelist
// @author       PythonCoderAS
// @description  Post chapter discussion to MyAnimeList from MangaDex.
// @grant        GM.getValue
// @grant        GM.setValue
// @homepage     https://github.com/PythonCoderAS/mangadex-post-to-myanimelist#readme
// @homepageURL  https://github.com/PythonCoderAS/mangadex-post-to-myanimelist#readme
// @match        https://mangadex.org/title/*
// @match        https://mangadex.org/chapter/*
// @run-at       load
// @source       git+https://github.com/PythonCoderAS/mangadex-post-to-myanimelist.git
// @supportURL   https://github.com/PythonCoderAS/mangadex-post-to-myanimelist/issues
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mangadex.org&size=64
// @version      ${packageData.version}
// ==/UserScript==`
);
