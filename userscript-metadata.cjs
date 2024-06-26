const { resolve } = require("path");

console.log(
  `// ==UserScript==
// @name         mangadex-post-to-myanimelist
// @author       PythonCoderAS
// @description  Post chapter discussion to MyAnimeList from MangaDex.
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.xmlHttpRequest
// @homepage     https://github.com/PythonCoderAS/mangadex-post-to-myanimelist#readme
// @homepageURL  https://github.com/PythonCoderAS/mangadex-post-to-myanimelist#readme
// @match        https://mangadex.org/*
// @match        https://myanimelist.net
// @connect      api.mangadex.org
// @connect      myanimelist.net
// @run-at       load
// @source       git+https://github.com/PythonCoderAS/mangadex-post-to-myanimelist.git
// @supportURL   https://github.com/PythonCoderAS/mangadex-post-to-myanimelist/issues
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mangadex.org&size=64
// @version      ${require(resolve(__dirname, "package.json")).version}
// ==/UserScript==`
);
