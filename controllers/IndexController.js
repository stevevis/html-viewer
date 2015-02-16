'use strict';

exports.get = function *() {
  yield this.render('index.html');
}
