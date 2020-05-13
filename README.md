![CI Status](https://github.com/dxw/project_wisdom/workflows/CI/badge.svg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Project Wisdom

A Zendesk App that fetches contextual information about a ticket from its custom
project field.

## Prerequisites

To run the app locally, you'll need to have the following installed:

* [Zendesk Apps Tools](https://develop.zendesk.com/hc/en-us/articles/360001075048-Installing-and-using-the-Zendesk-apps-tools) installed.
* [Foreman](http://ddollar.github.io/foreman/)
* Node.js 12.13.0 or greater

## Getting started

### Clone the repo

```bash
git clone git@github.com:dxw/project_wisdom.git
```

### Copy .zat.example to .zat

```bash
cp .zat.example .zat
```

### Add the username and password to the .zat file (optional)

Necessary if you want to run the server, but not if all you want is to run the test suite.

Where "username" is your Zendesk login with `/token` appended to the end (e.g. `foo@dxw.com/token`), and "password" is
available in the dxw 1Password as "Zendesk API Key".

### Install dependencies

```bash
./script/bootstrap
```

### Run the server locally

```bash
./script/server
```

You'll need the Airtable API Key and Base Key (available from the dxw 1Password).

### Access a ticket

Go to a ticket in Zendesk and append `?zat=true` to the url. eg:

```
https://dxw.zendesk.com/agent/tickets/123345?zat=true
```

Click on the `Apps` button on the ticket view to see the app in action!

## Running the tests

Run the following command:

```
./script/test
```

## Building and updating the app

The repo is set up to automatically push to Zendesk on every `master` push, but in case you want to
do this manually, you can run:

```
./script/build
```

to build the app in the `/dist` folder using [Webpack](https://webpack.js.org/), and generate a zip file of the
project in `dist/tmp`.

To update the app in Zendesk, run:

```
./script/build --push
```

This assumes you have the correct credentials in your `.zat` file.
