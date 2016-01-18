// /* global jest describe it expect beforeEach */
// 'use strict';

// jest.dontMock('../node');
// var Node = require('../node');

// var SimpleApiClient = require('simple-api-client');
// var noop = jest.genMockFunction();

// describe('Node', () => {
//   describe('constructor', () => {
//     it('should set opts provided', () => {
//       var node = new Node({ id: 1, party: true }, 'graph');
//       var expected = {
//         id: 1,
//         party: true,
//         graph: 'graph'
//       };
//       Object.keys(expected).forEach(function (key) {
//         expect(node[key]).toBe(expected[key]);
//       });
//     });
//   });

//   describe('methods', () => {
//     var n;
//     beforeEach(() => {
//       n = new Node({ id: 1 }, new SimpleApiClient());
//     });

//     describe('fetch', () => {
//       it('should call to fetch information', () => {
//         SimpleApiClient.prototype.get.mockImplementation(() => {
//           var cb = Array.prototype.slice.call(arguments).pop();
//           cb(null, { statusCode: 200 }, {});
//         });
//         n.fetch(noop);
//         expect(SimpleApiClient.prototype.get).toBeCalledWith(
//           'nodes/1',
//           noop);
//         SimpleApiClient.prototype.get.mockClear();
//         noop.mockClear();

//         // err res
//         var e = new Error('some err');
//         SimpleApiClient.prototype.get.mockImplementation(() => {
//           var cb = Array.prototype.slice.call(arguments).pop();
//           cb(e);
//         });
//         n.fetch(noop);
//         expect(noop.mock.calls[0][0]).toBe(e);
//         SimpleApiClient.prototype.get.mockClear();
//         noop.mockClear();

//         // valid response, non-200
//         SimpleApiClient.prototype.get.mockImplementation(() => {
//           var cb = Array.prototype.slice.call(arguments).pop();
//           cb(null, { statusCode: 400 }, {});
//         });
//         n.fetch(noop);
//         expect(noop.mock.calls[0][0].name).toBe('Error');
//         expect(noop.mock.calls[0][0].message).toBe('could not fetch node');
//         SimpleApiClient.prototype.get.mockClear();
//         noop.mockClear();
//       });
//     });

//     describe('update', () => {
//       it('should call to update information', () => {
//         SimpleApiClient.prototype.patch.mockImplementation(() => {
//           var cb = Array.prototype.slice.call(arguments).pop();
//           cb(null, { statusCode: 200 }, {});
//         });
//         n.update({ value: 'newValue' }, noop);
//         expect(SimpleApiClient.prototype.patch).toBeCalledWith(
//           'nodes/1',
//           {
//             json: true,
//             body: { value: 'newValue' }
//           },
//           noop);
//         SimpleApiClient.prototype.patch.mockClear();
//         noop.mockClear();

//         // err res
//         var e = new Error('some err');
//         SimpleApiClient.prototype.patch.mockImplementation(() => {
//           var cb = Array.prototype.slice.call(arguments).pop();
//           cb(e);
//         });
//         n.update({ value: 'newValue' }, noop);
//         expect(noop.mock.calls[0][0]).toBe(e);
//         SimpleApiClient.prototype.patch.mockClear();
//         noop.mockClear();

//         // valid response, non-200
//         SimpleApiClient.prototype.patch.mockImplementation(() => {
//           var cb = Array.prototype.slice.call(arguments).pop();
//           cb(null, { statusCode: 400 }, { message: 'bad request' });
//         });
//         n.update({ value: 'newValue' }, noop);
//         expect(noop.mock.calls[0][0].name).toBe('Error');
//         expect(noop.mock.calls[0][0].message)
//           .toBe('could not update node: bad request');
//         SimpleApiClient.prototype.patch.mockClear();
//         noop.mockClear();
//       });
//     });

//     describe('delete', () => {
//       it('should call to delete information', () => {
//         SimpleApiClient.prototype.delete.mockImplementation(() => {
//           var cb = Array.prototype.slice.call(arguments).pop();
//           cb(null, { statusCode: 204 }, {});
//         });
//         n.delete(noop);
//         expect(SimpleApiClient.prototype.delete).toBeCalledWith(
//           'nodes/1',
//           noop);
//         SimpleApiClient.prototype.delete.mockClear();
//         noop.mockClear();

//         // err res
//         var e = new Error('some err');
//         SimpleApiClient.prototype.delete.mockImplementation(() => {
//           var cb = Array.prototype.slice.call(arguments).pop();
//           cb(e);
//         });
//         n.delete(noop);
//         expect(noop.mock.calls[0][0]).toBe(e);
//         SimpleApiClient.prototype.delete.mockClear();
//         noop.mockClear();

//         // valid response, non-204
//         SimpleApiClient.prototype.delete.mockImplementation(() => {
//           var cb = Array.prototype.slice.call(arguments).pop();
//           cb(null, { statusCode: 400 }, { message: 'bad request' });
//         });
//         n.delete(noop);
//         expect(noop.mock.calls[0][0].name).toBe('Error');
//         expect(noop.mock.calls[0][0].message)
//           .toBe('could not delete node: bad request');
//         SimpleApiClient.prototype.delete.mockClear();
//         noop.mockClear();
//       });
//     });
//   });
// });
