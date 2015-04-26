var express = require('express');
var app = module.exports = express();

var envIs = require('101/env-is');
var find = require('101/find');
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

if (!envIs('test')) {
  app.use(require('morgan')('combined'));
}
app.use(require('body-parser').json());

app.get('/nodes',
  function (req, res) {
    res.json(nodes);
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
      res.sendStatus(404).send('Not Found');
    } else {
      res.status(200).json(n);
    }
  });

