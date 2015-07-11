// Generated by CoffeeScript 1.7.1
(function() {
  var arg, escape, key, on_error, out, py_escape, query, query_args, rs, rs_req, rsu, status, string, string_req, tags, val, _i, _len, _ref;

  tags = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

  escape = function(txt) {
    return txt.replace(/[&<>]g/, function(tag) {
      return tags[tag] || tag;
    }).replace(/\n/g, '&#10;').replace(/[ ]/g, '&nbsp;');
  };

  rsu = 'https://api.github.com/repos/kirbyfan64/rs/contents/rs.py';

  status = $('#status');

  out = $('#output');

  window.vm = new PyPyJS();

  vm.stdout = vm.stderr = function(data) {
    return out.html(out.html() + escape(data));
  };

  status.text('Loading PyPy.js (this might take a while)...');

  vm.ready.then(function() {
    status.text('Loading rs...');
    rs_req.open('GET', rsu, true);
    rs_req.setRequestHeader('Accept', 'application/vnd.github.v3.raw+json');
    return rs_req.send();
  }).then(null, function(err) {
    status.text('ERROR loading PyPy.js: ' + err);
    return status.css('color', 'red');
  });

  if ((query = window.location.href.split('?')[1]) != null) {
    if (query[query.length - 1] === '/') {
      query = query.substr(0, query.length - 1);
    }
    query_args = query.split('&');
    for (_i = 0, _len = query_args.length; _i < _len; _i++) {
      arg = query_args[_i];
      _ref = arg.split('='), key = _ref[0], val = _ref[1];
      $("#" + key).text(decodeURIComponent(val));
    }
  }

  rs = null;

  rs_req = new XMLHttpRequest();

  string = null;

  string_req = new XMLHttpRequest();

  rs_req.onload = function() {
    if ((rs = this.responseText) != null) {
      status.html('<br/>');
      rs = rs.replace('from __future__ import print_function', '');
      return vm.exec("from __future__ import print_function\n__name__ = None\n" + rs);
    } else {
      return status.text('ERROR loading rs!');
    }
  };

  on_error = function(err) {
    out.html(out.html() + (err.trace != null ? escape(err.trace) : 'INTERNAL ERROR: ' + err.toString()));
    if (err.trace == null) {
      throw err;
    }
  };

  py_escape = function(txt) {
    return txt.replace(/'/g, "\\'").replace(/\n/g, '\\n');
  };

  this.run_code = function() {
    var largs, lines, on_stdin_ready;
    largs = '';
    lines = [];
    out.css('color', 'black');
    out.html('');
    lines = $('#script').val().split(/(?:\n)+/g);
    if ($('#debug').prop('checked')) {
      largs += "'-g', ";
    }
    largs += lines.filter(function(line) {
      return line !== '';
    }).reduce((function(a, b) {
      return "" + a + "r'" + (py_escape(b)) + "', ";
    }), '');
    on_stdin_ready = function() {
      return vm.exec("from __future__ import print_function\nimport sys\n\nsys.argv = ['rs.py', " + largs + "]\nmain()").then(null, on_error);
    };
    vm.exec("import sys, cStringIO\nsys.stdin = cStringIO.StringIO('" + (py_escape($('#input').val().replace(/^\\n+|\\n+$/g, ''))) + "\\n')").then(on_stdin_ready).then(null, on_error);
    return run_code;
  };

  this.make_link = function() {
    out = $('#output');
    out.css('color', 'black');
    return out.html("http://kirbyfan64.github.io/rs/index.html?script=" + (encodeURIComponent($('#script').val())) + "&input=" + (encodeURIComponent($('#input').val())));
  };

}).call(this);