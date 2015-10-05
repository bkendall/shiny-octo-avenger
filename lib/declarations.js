/* eslint-disable */
/* @flow */
declare module '101/assign' {
  declare function exports<T>(dest: T, ...src: Array<Object>): T
}
declare module '101/env-is' { declare function exports(env: string): Boolean }
declare module '101/find-index' {
  declare function exports(src: Array<any>, pattern: Function): number
}
declare module '101/has-properties' {
  declare function exports(pattern: Object): Function
}
declare module '101/is-function' { declare function exports(src: any): Boolean }
declare module 'body-parser' { declare function json(): Function }
declare module 'boom' {
  declare function notFound(message: string): Object
}
declare module 'dat-middleware' {
  declare function req(key: string): any;
  declare function res(key: string): any;
  declare function body(key: (string | Object)): any;
  declare function params(key: string): any;
  declare function query(key: (string | Object)): any;
  declare function Boom(key: string): any;
}
declare module express { declare var exports: Function }
declare module 'middlewarize' { declare var exports: Function }
declare module 'morgan' { declare var exports: Function }
declare module 'uuid' { declare function exports(): Function }
