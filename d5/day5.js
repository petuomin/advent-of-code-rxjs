"use strict";

import Rx from 'rx';
import fs from 'fs';
import _ from 'lodash';
import {reject} from '../lib/Rx.Observable.extensions';

Rx.Observable.prototype.reject = reject;

const input = fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : process.argv[2];
const words = Rx.Observable.from(input.split('\n'));

words
  .filter(hasThreeVowels)
  .filter(hasLetterTwiceInARow)
  .reject(hasForbiddenSubstring)
  .count()
  .subscribe(function(count) {
    console.log(`Part 1: ${count}`);
  });

words
  .filter(hasLetterWithSomethingInBetween)
  .filter(hasPairAtLeastTwice)
  .count()
  .subscribe(function(count) {
    console.log(`Part 2: ${count}`);
  });

function hasLetterWithSomethingInBetween(str) {
    return groups(str.split(''), 3).filter(endsEqual).length > 0;
}

function hasThreeVowels(str) {
  return str.split('').filter(_.curry(_.includes)(['a', 'e', 'i', 'o', 'u'])).length >= 3;
}

function hasLetterTwiceInARow(str) {
  return groups(str.split(''), 2).filter(endsEqual).length > 0;
}

function hasForbiddenSubstring(str) {
  return _.intersection(groups(str.split(''), 2).map(_.curry(join)('')), ['ab', 'cd', 'pq', 'xy']).length > 0;
}

function endsEqual(arr) {
  return _.first(arr) === _.last(arr);
}

function join(char, arr) {
  return arr.join(char);
}

function groups(arr, size) {
  return arr.reduce((acc, char) => {
   
    _.range(1, size).forEach(i => {
      if (acc[acc.length - i] !== undefined) {
        acc[acc.length - i].push(char);
      }
    });
    
    acc.push([char]);
    return acc;
  }, []).slice(0, -(size - 1));
}

function hasPairAtLeastTwice(str) {

  const count = groups(str.split(''), 2)
    .map(_.curry(join)(''))
    .reduce((acc, item) => {
      if (item == acc.prev) {
        acc.prev = undefined;
        return acc;
      }
      acc.prev = item;
      return _.set(acc, item, _.add(_.get(acc, item), 1));
    }, {});

  return _.max(_.values(_.omit(count, 'prev'))) >= 2;
}
