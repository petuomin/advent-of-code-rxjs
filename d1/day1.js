"use strict";

import Rx from 'rx';
import fs from 'fs';

const input = fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : process.argv[2];
const moves = Rx.Observable.from(input.split(''));

moves
  .map(parseMove)
  .reduce((acc, floorDelta) => acc + floorDelta)
  .subscribe((floor) => {
    console.log(`Part 1: ${floor}`);
  });

moves
  .map(parseMove)
  .scan((acc, floorDelta) => acc + floorDelta)
  .map((floor, idx) => ({floor, idx}))
  .filter(position => position.floor === -1)
  .take(1)
  .map(position => position.idx + 1)
  .subscribe((position) => {
    console.log(`Part 2: ${position}`);
  });

function parseMove(char) {
  switch (char) {
    case '(': return 1;
    case ')': return -1;
    default: return 0;
  }
}
