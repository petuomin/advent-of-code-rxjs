"use strict";

import Rx from 'rx';
import fs from 'fs';
import _ from 'lodash';

const input = fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : process.argv[2];

const coordinateDeltas = Rx.Observable.from(input.split('')).map(charToCoordinateDelta);

coordinateDeltas
  .scan(addCoordinates, [0, 0])
  .distinct()
  .count()
  .subscribe((numberOfHouses) => {
    console.log(`Part 1: ${numberOfHouses}`);
  });

const [santaHouses, roboHouses] = coordinateDeltas
  .partition((x, i) => i % 2 === 0)
  .map(deltas => {
    return deltas.scan(addCoordinates, [0,0]);
  });

Rx.Observable.merge(santaHouses, roboHouses)
  .distinct()
  .count()
  .subscribe((numberOfHouses) => {
    console.log(`Part 2: ${numberOfHouses}`);
  });

function addCoordinates(augend, addend) {
  return _.zipWith(augend, addend, _.add);
}

function charToCoordinateDelta(char) {
  if (char === "<") return [-1, 0];
  if (char === ">") return [1, 0];
  if (char === "^") return [0, 1];
  if (char === "v") return [0, -1];
  throw new Error(`Unknown char ${char}`);
}
