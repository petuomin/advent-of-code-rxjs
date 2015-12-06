"use strict";

import Rx from 'rx';
import fs from 'fs';
import _ from 'lodash';

const input = fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : process.argv[2];
const commands = input.split('\n').map(parseCommand);

const lights = Rx.Observable.from(lightCoordinateGenerator(1000, 1000));

lights
  .map(setOff)
  .map(_.curry(applyCommands)(applyPart1Action))
  .filter(light => light.on)
  .count()
  .subscribe(numberOfLightsOn => {
    console.log(`Part 1: ${numberOfLightsOn}`);
  });

lights
  .map(_.curry(applyCommands)(applyPart2Action))
  .map(light => _.get(light, 'brightness', 0))
  .sum()
  .subscribe(totalBrightnessOfLights => {
    console.log(`Part 2: ${totalBrightnessOfLights}`);
  });


function applyCommands(translatorFn, light) {

  return commands.reduce((lightAcc, command) => {
    if (insideRectangle(command, lightAcc)) {
      translatorFn(command.action, lightAcc);
    }
    return lightAcc;
  }, {...light});
}

function applyPart1Action(phrase, light) {
  if (phrase === 'toggle') light.on = !light.on;
  if (phrase === 'turn on') light.on = true;
  if (phrase === 'turn off') light.on = false;
}

function applyPart2Action(phrase, light) {
  if (phrase === 'toggle') light.brightness = _.add(light.brightness, 2);
  if (phrase === 'turn on') light.brightness = _.add(light.brightness, 1);
  if (phrase === 'turn off') light.brightness = _.add(light.brightness, -1);
  if (light.brightness < 0) light.brightness = 0;
}

function insideRectangle(rect, point) {
  return _.inRange(point.x, rect.x0, rect.x1 + 1) &&
         _.inRange(point.y, rect.y0, rect.y1 + 1);
}

function setOff(light) {
  return _.set(light, 'on', false);
}

function parseCommand(str) {
  let c0idx;
  let c1idx;
  let action;

  if (str.startsWith("turn on")) {
    c0idx = 2;
    c1idx = 4;
    action = 'turn on';
  }
  if (str.startsWith("turn off")) {
    c0idx = 2;
    c1idx = 4;
    action = 'turn off';
  }
  if (str.startsWith("toggle")) {
    c0idx = 1;
    c1idx = 3;
    action = 'toggle';
  }

  const [x0, y0] = str.split(' ')[c0idx].split(',').map(Number);
  const [x1, y1] = str.split(' ')[c1idx].split(',').map(Number);

  return { x0, y0, x1, y1, action };
}


function *lightCoordinateGenerator(maxX, maxY) {
  let x = 0;
  let y = 0;

  while (y < maxY) {
    yield {x, y};
    x++;
    if (x >= maxX) {
      y++;
      x = 0;
    }
  }
}

