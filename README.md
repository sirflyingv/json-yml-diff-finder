### GenDiff

A JavaScript program that compares data in two files and shows the difference. GenDiff can work with JSON and YAML format and can be used as both a CLI tool and a Node.js module.

### Hexlet tests and linter status:

[![Actions Status](https://github.com/sirflyingv/frontend-project-46/workflows/hexlet-check/badge.svg)](https://github.com/sirflyingv/frontend-project-46/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/907c21406f66906d8c18/maintainability)](https://codeclimate.com/github/sirflyingv/frontend-project-46/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/907c21406f66906d8c18/test_coverage)](https://codeclimate.com/github/sirflyingv/frontend-project-46/test_coverage)
[![tests](https://github.com/sirflyingv/frontend-project-46/actions/workflows/tests.yml/badge.svg)](https://github.com/sirflyingv/frontend-project-46/actions/workflows/tests.yml)

Stylish print of 2 tree files diff [asciinema](https://asciinema.org/a/6w66dlNKUMzIJnvFujRJdTghJ)

Both 'stylish' and 'plain' types of output [asciinema](https://asciinema.org/a/Imgcsr85kjQZEjnZbgdyNshk7)

JSON output [asciinema](https://asciinema.org/a/GRxSWMIaoJSdqN7vH4BLztKEJ)

### Installation

To install GenDiff, download source code and run the following command in repo directory:
```
make install
make publish
sudo npm link
```
### Usage 

#### CLI
```
Usage: gendiff [options] <filepath1> <filepath2>

Compares two configuration files and shows a difference.

Arguments:
  filepath1              path to first file
  filepath2              path to second file

Options:
  -V, --version          output the version number
  -f, --format <format>  output format (default: "stylish")
  -h, --help             display help for command
```

#### Node module

In directory of your project run:

`npm install <path to gendiff repo>`
