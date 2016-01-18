'use strict';
import express from 'express';
const app = express();
export const server = app;

import bodyParser from 'body-parser';
import envIs from '101/env-is';
import middlewarize from 'middlewarize';
import mw from 'dat-middleware';
import morgan from 'morgan';

import _node from './lib/node';
import _association from './lib/association';

const node = middlewarize(_node);
const association = middlewarize(_association);

app.use(morgan('combined', { skip: () => (envIs('false')) }));
app.use(bodyParser.json());

app.get('/nodes',
  mw.query({ or: [ 'label', 'value', 'id' ] }).pick().require().string(),
  node.find('query', 'cb').async('nodes'),
  mw.res.json('nodes'));

app.post('/nodes',
  mw.body('label', 'value').pick().require().string(),
  node.new('body.label', 'body.value'),
  mw.res.status(201), mw.res.json('node'));

app.get('/nodes/:id',
  mw.params('id').pick().require().string(),
  node.findOne({ id: 'params.id' }, 'cb').async('node'),
  mw.req('node').require(),
  mw.res.json('node'));

app.patch('/nodes/:id',
  mw.params('id').pick().require().string(),
  mw.body({ or: [ 'label', 'value' ] }).pick().require().string(),
  node.findOne({ id: 'params.id' }, 'cb').async('node'),
  mw.req('node').require(),
  node.instance.update('body', 'cb'),
  mw.res.json('node'));

app.delete('/nodes/:id',
  mw.params('id').pick().require().string(),
  node.findOne({ id: 'params.id' }, 'cb').async('node'),
  mw.req('node').require(),
  node.instance.delete('cb'),
  mw.res.status(204),
  mw.res.end());

app.get('/associations',
  mw.query('from').require(),
  mw.query('count').require().then(
    mw.query('from', 'count', 'label').pick().string(),
    mw.query('label').require()
      .then(association.count('from', 'cb'))
      .else(association.count('from', 'label', 'cb')),
    mw.res.json({ 'count': 'associations.length' })),
  mw.query({ or: [ 'from', 'label' ] }).require().then(
    mw.query('from', 'label').pick().require().string(),
    node.findOne({ id: 'query.from' }, 'cb').async('node'),
    association.fetch('node.id', 'query.label', 'cb').async('associations'),
    mw.res.json('associations')),
  (req, res, next) => { next(mw.Boom.notAcceptable()); });

app.post('/associations',
  mw.body('from', 'label', 'to').require().pick().string(),
  node.findOne({ id: 'body.from' }, 'cb').async('from'),
  node.findOne({ id: 'body.to' }, 'cb').async('to'),
  mw.req('from', 'to').require(),
  association.new('from.id', 'body.label', 'to.id'),
  mw.res.status(201), mw.res.json('association'));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (!err.isBoom) {
    err = mw.Boom.wrap(err, 500, 'Server Error');
  }
  res.status(err.output.statusCode);
  res.json(err.output.payload);
});
