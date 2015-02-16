'use strict';

var React = require('react');

var TagsPanel = React.createClass({
  getInitialState: function() {
    return {
      highlighted: null
    }
  },

  handleClick: function(tagName) {
    if (this.state.highlighted) {
      // Un-highlight the previously clicked tag
      $('.tag-' + this.state.highlighted).css('background-color', 'transparent');
    }

    // Highlight the clicked tag
    $('.tag-' + tagName).css('background-color', '#37BC9B');

    // Set the state to the store the highlighted tag
    this.setState({
      highlighted: tagName
    })
  },

  render: function() {
    return (
      <div className="col-md-2">
        <div id="tags">
          {this.props.tags.map(function(tag) {
            return (
              <button key={tag.name} className="btn btn-info tag" type="button" onClick={this.handleClick.bind(this, tag.name)}>
                { tag.name }<span className="badge">{ tag.count }</span>
              </button>
            )
          }.bind(this))}
        </div>
      </div>
    );
  }
});

module.exports = TagsPanel;
