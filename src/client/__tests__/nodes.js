// /* global jest describe it expect beforeEach */
// 'use strict';

// jest.dontMock('../index');
// var Client = require('../index');
// var c;

// var SimpleApiClient = require('simple-api-client');
// var noop = jest.genMockFunction();

// beforeEach(function () {
//   c = new Client('localhost:3000');
// });

// describe('Node', function () {
//   describe('create', function () {
//     it('calls the graph to create nodes', function () {
//       c.createNode('label', 'value', noop);
//       expect(SimpleApiClient.prototype.post).toBeCalledWith(
//         'nodes',
//         {
//           json: true,
//           body: {
//             label: 'label',
//             value: 'value'
//           }
//         },
//         noop);
//       SimpleApiClient.prototype.post.mockClear();

//       c.createNode('value', noop);
//       expect(SimpleApiClient.prototype.post).toBeCalledWith(
//         'nodes',
//         {
//           json: true,
//           body: {
//             label: 'value',
//             value: null
//           }
//         },
//         noop);
//       SimpleApiClient.prototype.post.mockClear();

//       c.createNode(noop);
//       expect(SimpleApiClient.prototype.post).toBeCalledWith(
//         'nodes',
//         {
//           json: true,
//           body: {
//             label: null,
//             value: null
//           }
//         },
//         noop);
//       SimpleApiClient.prototype.post.mockClear();
//     });
//   });

//   describe('new', function () {
//     it('creates a new node with opts', function () {
//       // TODO I have no idea how to make sure a _Node_ was created
//       var n = c.newNode({
//         label: 'newLabel',
//         value: 'newValue'
//       });
//       expect(n).toBeTruthy();
//     });
//   });
// });
