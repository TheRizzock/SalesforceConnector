// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
//        pageUrl: {urlMatches: '(salesforce|force)\.com'},
      })],

      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

let source = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // sent from another content script, intended for saving source
    if(request.action === 'putSource') {
        source = request.source;
        chrome.windows.create({
        // Just use the full URL if you need to open an external page
            url: chrome.runtime.getURL("libs/Meeting-Sheets/options.html"),
            type: "popup",
            height: 480,
            width: 490
        });
    }
    if(request.action === 'putSourceTwo'){
        console.log('two')
        source = request.source
        var url = chrome.extension.getURL('libs/Meeting-Sheets/miso.html');
        chrome.tabs.create({url: url, active: true});
    }



    // sent from newtab-contentscript, to get the source
    if(request.action === 'getSource') {
        sendResponse({ source: source });
    }
});

let reds = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // sent from another content script, intended for saving source
    if(request.action === 'articleSource') {
        reds = request.source;
        var url = chrome.extension.getURL('libs/Red-Issue-Scraper/redIssue.html');
        console.log(reds)
        chrome.tabs.create({url: url, active: true});
    }
    // sent from newtab-contentscript, to get the source
    if(request.action === 'getArticle') {
        console.log(reds)
        sendResponse({ source: reds });
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
        console.log('Page uses History API and we heard a pushSate/replaceState.');
        if (details.url.includes('.force.com')){
            // do your thing
            chrome.tabs.executeScript({
                file: "libs/Red-Issue-Scraper/SF-Badge.js"
            }, function () {
                console.log("Injection is Completed");
            });
        }
  });