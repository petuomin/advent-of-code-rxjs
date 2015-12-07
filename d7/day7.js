"use strict";

import Rx from 'rx';
import fs from 'fs';
import _ from 'lodash';

const input = fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : process.argv[2];
const commands = input.split('\n');

const op = {
  AND: (a,b) => a & b,
  OR: (a,b) => a | b,
  RSHIFT: (a,b) => a >> b,
  LSHIFT: (a,b) => a << b,
  NOT: (a) => ~(a) & 0xFFFF,
  PASS: (a) => a
};

const wires1 = commands
  .map(parseCommand)
  .reduce(wireComponent, {});

wires1.a.subscribe(a_output => {
  console.log(`Part 1: ${a_output}`);
});

wires1.a.subscribe(a_output => {

  const wires2 = commands
    .map(parseCommand)
    .map(setWireInput('b', a_output))
    .reduce(wireComponent, {});

  wires2.a.subscribe(a_output => {
    console.log(`Part 2: ${a_output}`);
  });
});

function parseCommand(str) {
  const [sourceDefinitionString, output] = str.split("->").map(_.trim);
  const sourceDefinition = sourceDefinitionString.split(' ');
  
  if (sourceDefinition.length == 1) {
    const [source] = sourceDefinition;
    return { gate: 'PASS', sources: [source], output };
  }

  if (sourceDefinition.length == 2) {
    const [gate, source] = sourceDefinition;
    return { gate, sources: [source], output };
  }

  if (sourceDefinition.length == 3) {
    const [source1, gate, source2] = sourceDefinition;
    return { gate, sources: [source1, source2], output };    
  }
}

function wireComponent(wires, command) {
 const output = getOrInitSource(wires, command.output);
  
  if (command.sources.length == 1) {

    const source = getOrInitSource(wires, command.sources[0]);

    source 
      .map(op[command.gate])
      .subscribe(output);
  }
  if (command.sources.length == 2) {
    const source1 = getOrInitSource(wires, command.sources[0]);
    const source2 = getOrInitSource(wires, command.sources[1]);

    Rx.Observable.combineLatest(source1, source2, op[command.gate])
      .subscribe(output);
  }
  return wires;
}

function getOrInitSource(wires, s) {
  if (isSignal(s)) {
    const input = new Rx.ReplaySubject(1);
    input.onNext(parseInt(s, 10));
    return input;
  }
  if (wires[s] === undefined) {
    wires[s] = new Rx.ReplaySubject(1);
  }
  return wires[s];
}

function isSignal(source) {
  return !isNaN(source);
}

function setWireInput(wireLabel, value) {
  return function(command) {
    if (command.output === wireLabel) {
      return {
        ...command,
        sources: [value]
      };
    }
    return command;
  };
}
