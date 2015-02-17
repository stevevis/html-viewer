'use strict';

var React = require('react');
var request = require('superagent');
var validator = require('validator');
var TagsPanel = require('./TagsPanel.react');
var SourcePanel = require('./SourcePanel.react');

// Request a summary of the HTML at the URL from the SummaryController
var getSummary = function(url, callback, error) {
  request
    .get('/summary')
    .query({url: url})
    .on('error', error)
    .end(callback);
};

var HtmlViewer = React.createClass({
  getInitialState: function() {
    return { 
      source: 'No source',
      tags: [
        { 
          name: 'No tags',
          count: 0 
        }
      ]
    };
  },

  componentDidMount: function() {
    var currentTag = '';

    // Add a prism hook so we can add custom CSS classes to HTML tags so we can highlight them
    Prism.hooks.add('wrap', function(env) {
      this.state.tags.forEach(function(tag) {
        // The content property for the tag element will look like "...</span>tagname"
        if ((env.type === 'tag' || env.type === 'script') &&
            (new RegExp('<\/span>' + tag.name + '$')).test(env.content)) {
          env.classes.push('tag-' + tag.name);
          currentTag = tag.name;
        }
      });

      if (currentTag && env.type === 'punctuation' && env.content === '>') {
        env.classes.push('tag-' + currentTag);
        currentTag = false;
      }
    }.bind(this));
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var url = this.refs.url.getDOMNode().value.trim();
    if (!url) { 
      return;
    }

    getSummary(url, function(response) {
      if (response.ok) {
        this.setState({ 
          source: response.body.source,
          tags: response.body.tags
        });

        // Highlight the source code using Prism
        Prism.highlightAll();
      } else {
        this.handleError();
      }
    }.bind(this), this.handleError);
  },

  handleError: function() {
    this.setState({
      source: 'Could not load source',
      tags: [
        { 
          name: 'Error',
          count: 0 
        }
      ]
    });
  },

  handleUrlChange: function(e) {
    var url = e.target.value;
    var buttonNode = this.refs.requestButton.getDOMNode();

    // If the URL is valid, enable the button, otherwise disable
    if (validator.isURL(url)) {
      buttonNode.removeAttribute('disabled');
    } else {
      if (!buttonNode.hasAttribute('disabled')) {
        buttonNode.setAttribute('disabled', 'disabled');
      }
    }
  },

  render: function() {
    return (
      <div className="container-fluid">
        <div className="row url-row">
          <div className="col-md-12">
            <form className="form-inline navbar-form" role="form" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input type="text" className="form-control address" id="view-url" placeholder="Enter a URL" ref="url" onChange={this.handleUrlChange} />
              </div>
              <button type="submit" className="btn btn-primary" ref="requestButton" disabled="disabled">Request</button>
            </form>
          </div>
        </div>
        <div className="row">
          <TagsPanel tags = { this.state.tags } />
          <SourcePanel source = { this.state.source } />
        </div>
      </div>
    );
  }
});

module.exports = HtmlViewer;
