"use strict";

import Rx from 'rx';
import fs from 'fs';
import _ from 'lodash';

const input = fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : process.argv[2];

const presentSizes = Rx.Observable.from(input.split("\n")).map(parseDimensions);

presentSizes
  .map(calculateSideSizes)
  .map(calculatePaperNeeded)
  .reduce((totalPaperNeeded, presentPaperNeed) => totalPaperNeeded + presentPaperNeed)
  .subscribe(totalPaperNeeded => {
    console.log(`Part 1: ${totalPaperNeeded}`);
  });

const ribbonAround = presentSizes
  .map(perimeters)
  .map(x => _.min(x));

const ribbonBow = presentSizes
  .map(volume);

Rx.Observable.zip(ribbonAround, ribbonBow, _.add)
  .reduce((totalRibbonNeeded, presentRibbonNeeded) => totalRibbonNeeded + presentRibbonNeeded)
  .subscribe(totalRibbonNeeded => {
    console.log(`Part 2: ${totalRibbonNeeded}`);
  });

function parseDimensions(str) {
  return str.split("x").map(toNumber);
}

function calculateSideSizes(dimensions) {
  const [w, h, l] = dimensions;
  return [w * h, h * l, l * w];
}

function calculatePaperNeeded(presentSides) {
  const [a, b, c] = presentSides;
  return 2 * a + 2 * b + 2 * c + _.min(presentSides);
}

function perimeters(dimensions) {
  const [w, h, l] = dimensions;
  return [w + h, h + l, l + w].map(x => x * 2);
}

function volume(dimensions) {
  const [w, h, l] = dimensions;
  return w * h * l;
}

function toNumber(str) {
  return parseInt(str, 10);
}

