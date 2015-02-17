'use strict';

var app = require('../../server');
var Browser = require('zombie');
var http = require('http');

var htmlViewerUrl = 'http://localhost:3333';

var urlInput = 'form input.address';
var requestButton = 'form button.request';
var tagsDiv = '#tags';
var sourceDiv = '#source';
var htmlTagButton = tagsDiv + ' .html-btn';
var htmlTagSource = sourceDiv + ' .tag-html';
var bodyTagButton = tagsDiv + ' .body-btn';
var bodyTagSource = sourceDiv + ' .tag-body';

describe('html-viewer', function() {
  var server;
  var browser;

  before(function() {
    server = http.createServer(app.callback()).listen(3333);
    browser = new Browser({ site: htmlViewerUrl, silent: true });
  });

  it('should show the HTML viewer page with a URL input form', function() {
    return browser.visit('/')
      .then(function() {
        browser.assert.success();
        browser.assert.element(urlInput, 'Could not find the URL input field');
        browser.assert.element(requestButton, 'Could not find the request button');
        browser.assert.element(tagsDiv, 'Could not find the tags component div');
        browser.assert.element(sourceDiv, 'Could not find the source component div');
      });
  });

  it('should enable the request button when a valid URL is entered', function() {
    return browser.visit('/')
      .then(function() {
        browser.assert.attribute(requestButton, 'disabled', '', 'The request button should be disabled');
        browser.fill(urlInput, htmlViewerUrl);
      })
      .then(function() {
        browser.assert.attribute(requestButton, 'disabled', null, 'The request button should be enabled');
      });
  });

  it('should not enable the request button when an invalid URL is entered', function() {
    return browser.visit('/')
      .then(function() {
        browser.assert.attribute(requestButton, 'disabled', '', 'The request button should be disabled');
        browser.fill(urlInput, 'http:/localhost');
      })
      .then(function() {
        browser.assert.attribute(requestButton, 'disabled', '', 'The request button should be disabled');
      });
  });

  it('should render the source and tags when a URL is requested', function() {
    return browser.visit('/')
      .then(function() {
        browser.fill(urlInput, htmlViewerUrl);
        return browser.pressButton(requestButton);
      })
      .then(function() {
        browser.assert.elements(htmlTagSource, { atLeast: 1 }, 'Could not find a <html> tag in the source');
        browser.assert.elements(htmlTagButton, { atLeast: 1 }, 'Could not find a <html> tag button in the tags list');
      });
  });

  it('should highlight the tag in the source when a tag button is pressed', function() {
    return browser.visit('/')
      .then(function() {
        browser.fill(urlInput, htmlViewerUrl);
        return browser.pressButton(requestButton);
      })
      .then(function() {
        return browser.pressButton(htmlTagButton);
      })
      .then(function() {
        // TODO This is a bit fragile...
        browser.assert.attribute(htmlTagSource, 'style', 'background-color: rgb(55, 188, 155);', 'The <html> tags should be highlighted');
      });
  });

  it('should un-highlight the tag in the source when another tag button is pressed', function() {
    return browser.visit('/')
      .then(function() {
        browser.fill(urlInput, htmlViewerUrl);
        return browser.pressButton(requestButton);
      })
      .then(function() {
        return browser.pressButton(htmlTagButton);
      })
      .then(function() {
        return browser.pressButton(bodyTagButton);
      })
      .then(function() {
        // TODO This is a bit fragile...
        browser.assert.attribute(htmlTagSource, 'style', 'background-color: transparent;', 'The <html> tags should not be highlighted');
        browser.assert.attribute(bodyTagSource, 'style', 'background-color: rgb(55, 188, 155);', 'The <body> tags should be highlighted');
      });
  });

  after(function(done) {
    browser.close();
    server.close(done);
  });
});
