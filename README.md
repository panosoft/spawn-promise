# spawn-promise

Spawns a process and makes it simple to pipe data in and get data out.

[![npm](https://img.shields.io/npm/v/spawn-promise.svg)]()
[![npm](https://img.shields.io/npm/l/spawn-promise.svg)]()
[![Travis](https://img.shields.io/travis/panosoft/spawn-promise.svg)]()
[![David](https://img.shields.io/david/panosoft/spawn-promise.svg)]()
[![npm](https://img.shields.io/npm/dm/spawn-promise.svg)]()

## Installation

    npm install spawn-promise

## Usage

    var spawn = require(spawn-promise);

    spawn('grep', ['H'], 'Hello').then(function (buffer) {
      console.log(buffer.toString()); // Hello
    });

## API

### spawn( command [, args] [, input] )

Spawns a child process with the given `command`, writes the `input` value to `stdin`, and returns a `Promise` that is fulfilled with the concatenated `stdout` buffer.

#### Arguments

- `command` - The command to run.
- `args` - An array of arguments.
- `input` - The value to write to `stdin`.
