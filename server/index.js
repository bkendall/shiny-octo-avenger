'use strict';

var express = require('express');
var app = module.exports = express();

var envIs = require('101/env-is');
var middlewarize = require('middlewarize');
var mw = require('dat-middleware');

var node = middlewarize(require('./lib/node'));
var edge = middlewarize(require('./lib/edge'));

app.use(require('morgan')('combined', {
  skip: function () { return envIs('test'); }
}));
app.use(require('body-parser').json());

app.get('/nodes',
  mw.query('from', 'follow').pick().string().require().then(
    node.find({ id: 'query.from' }, 'cb').async('node'),
    edge.follow('node.id', 'query.follow', 'cb').async('edges'),
    node.findFromEdges('edges', 'cb').async('nodes'),
    mw.res.json('nodes')),
  node.find({}, 'cb').async('nodes'),
  mw.res.json('nodes'));

app.post('/nodes',
  mw.body('value').pick().require().string(),
  node.new('body.value'),
  mw.res.status(201), mw.res.json('node'));

app.get('/nodes/:id',
  mw.params('id').pick().require().string(),
  node.find({ id: 'params.id' }, 'cb').async('node'),
  mw.req('node').require(),
  mw.res.json('node'));

app.delete('/nodes/:id',
  mw.params('id').pick().require().string(),
  node.find({ id: 'params.id' }, 'cb').async('node'),
  mw.req('node').require(),
  node.instance.delete('cb'),
  mw.res.status(204),
  mw.res.end());

app.post('/edges',
  mw.body('from', 'label', 'to').pick().require().string(),
  node.find({ id: 'body.from' }, 'cb').async('from'),
  node.find({ id: 'body.to' }, 'cb').async('to'),
  mw.req('from', 'to').require(),
  edge.new('from.id', 'body.label', 'to.id'),
  mw.res.status(201), mw.res.json('edge'));

app.use(function boomErrorHandler (err, req, res, next) {
  if (err.isBoom) {
    res.status(err.output.statusCode);
    res.json(err.output.payload);
  } else {
    next(err);
  }
});

