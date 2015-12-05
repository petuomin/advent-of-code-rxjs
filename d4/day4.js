"use strict";

import Rx from 'rx';
import _ from 'lodash';
import md5 from 'md5';

const input = process.argv[2];

const positiveIntegers = Rx.Observable.from(positiveIntegerGenerator());
const key = Rx.Observable.just(input);

Rx.Observable.combineLatest(key, positiveIntegers, (x, y) => ({index: y, value: '' + x + y}))
  .map(md5value)
  .filter(_.curry(hashStartsWith)("00000"))
  .take(1)
  .subscribe(result => {
    console.log(`Part 1: ${result.index} (${result.hash})`);
  });

Rx.Observable.combineLatest(key, positiveIntegers, (x, y) => ({index: y, value: '' + x + y}))
  .map(md5value)
  .filter(_.curry(hashStartsWith)("000000"))
  .take(1)
  .subscribe(result => {
    console.log(`Part 2: ${result.index} (${result.hash})`);
  });

function *positiveIntegerGenerator() {
  var i = 1;
  while (true) {
    yield i++;
  }
}

function md5value(o) {
  return {
    index: o.index,
    hash: md5(o.value)
  };
}

function hashStartsWith(prefix, o) {
  return o.hash.startsWith(prefix);
}
