'use strict';

var URL = require('url-parse');
var validator = require('validator');
var request = require('request')
var htmlparser = require('htmlparser2');
var through = require('through');
var Q = require('q');

// Get the HTML that lives at sourceUrl and pipe it through an HTML parser to count the number of each tag and return
// the full HTML source as well as the tag counts
var getSummary = function *(sourceUrl) {
  var summary = {
    source: '',
    tags: {}
  };

  var deferred = Q.defer();

  // Build a map of tags with a count of how many times they appeared
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs) {
      if (summary.tags[name]) {
        summary.tags[name] += 1;
      } else {
        summary.tags[name] = 1;
      }
    }
  });

  var summaryStream = through(
    function write(data){
      parser.write(data);
      summary.source += data;
    },
    function end() {
      parser.end();
      this.queue(null)
      deferred.resolve(summary);
    }
  );

  request.get(sourceUrl).pipe(summaryStream);

  return deferred.promise;
}

// Convert a map of tag objects into an ordered array of tags
// e.g. { body: 1, div: 2 } -> [ { name: div, count: 2 }, { name: body, count: 1 } ]
var orderTags = function(tags) {
  var orderedTags = [];

  for (var tag in tags) {
    if (tags.hasOwnProperty(tag)) {
      orderedTags.push({ name: '<' + tag + '>', count: tags[tag] });
    }
  }

  orderedTags.sort(tagCountComparator)

  return orderedTags;
}

// Compare two tag objects based on their count property
var tagCountComparator = function(tag1, tag2) {
  if (tag1.count < tag2.count) {
    return 1;
  }
  if (tag1.count > tag2.count) {
    return -1;
  }
  return 0;
}

exports.get = function *(next) {
  var rawUrl = this.query.url;

  // Validate the URL, this doesn't require a protocol
  if (!validator.isURL(rawUrl)) {
    return yield next;
  }

  // Parse the URL and add a protocol if one wasn't provided e.g. google.com -> http://google.com
  var parsedUrl = new URL(rawUrl)
  if (!parsedUrl.protocol) {
    parsedUrl.protocol = 'http:';
  }

  // Get the summary of the HTML at the given URL
  var summary = yield getSummary(parsedUrl.toString());
  summary.tags = orderTags(summary.tags);

  this.body = summary;
}
