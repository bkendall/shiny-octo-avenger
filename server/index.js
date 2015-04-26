var express = require('express');
var app = module.exports = express();

var envIs = require('101/env-is');
var find = require('101/find');
var findIndex = require('101/find-index');
var hasProps = require('101/has-properties');
var uuid = require('uuid');

var nodes = [];
var edges = [];

function createNode (value) {
  var n = {
    id: uuid(),
    value: value
  };
  nodes.push(n);
  return n;
}

function createEdge (from, label, to) {
  var e = {
    id: uuid(),
    from: from,
    label: label,
    to: to
  };
  edges.push(e);
  return e;
};

if (!envIs('test')) {
  app.use(require('morgan')('combined'));
}
app.use(require('body-parser').json());

app.get('/nodes',
  function (req, res) {
    if (req.query.from && req.query.follow) {
      var n = find(nodes, hasProps({ value: req.query.from }));
      var _edges = edges.filter(function (e) {
        return e.from === n.id && e.label === req.query.follow;
      });
      var foundNodes = _edges.reduce(function (memo, e) {
        var _n = find(nodes, hasProps({ id: e.to }));
        if (_n) { memo.push(_n); }
        return memo;
      }, []);
      res.json(foundNodes);
    } else {
      res.json(nodes);
    }
  });

app.post('/nodes',
  function (req, res) {
    var n = createNode(req.body.value);
    res.status(201).json(n);
  });

app.get('/nodes/:id',
  function (req, res) {
    var n = find(nodes, hasProps({ value: req.params.id }));
    if (!n) {
      res.sendStatus(404);
    } else {
      res.status(200).json(n);
    }
  });

app.delete('/nodes/:id',
  function (req, res) {
    var n = findIndex(nodes, hasProps({ value: req.params.id }));
    if (n === -1) {
      res.sendStatus(404);
    } else {
      nodes.splice(n, 1);
      res.sendStatus(204);
    }
  });

app.post('/edges',
  function (req, res) {
    var n1 = find(nodes, hasProps({ value: req.body.from }));
    var n2 = find(nodes, hasProps({ value: req.body.to }));
    var e = createEdge(n1.id, req.body.label, n2.id);
    res.status(201).json(e);
  });

