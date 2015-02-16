'use strict';

var React = require('react');
var PrismCode = require('react-prism').PrismCode;

var SourcePanel = React.createClass({
  render: function() {
    return (
      <div className="col-md-10">
        <div id="source">
          <pre className="language-markup">
            <code className="language-markup">
              { this.props.source }
            </code>
          </pre>
        </div>
      </div>
    );
  }
});

module.exports = SourcePanel;
