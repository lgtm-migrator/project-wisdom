![CI Status](https://github.com/dxw/project_wisdom/workflows/CI/badge.svg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Project Wisdom

A Zendesk App that fetches contextual information about a ticket from its custom
project field.

## Prerequisites

To run the app locally, you'll need to have the following installed:

* Ruby 2.x
* Node.js 12.13.0 or greater

## Getting started

### Clone the repo

```bash
git clone git@github.com:dxw/project_wisdom.git
```

### Run the setup task

```bash
./script/setup
```

### Add the username and password to the .zat file (optional)

Necessary if you want to run the server, but not if all you want is to run the test suite.

Where "username" is your Zendesk login with `/token` appended to the end (e.g. `foo@dxw.com/token`), and "password" is
available in the dxw 1Password as "Zendesk API Key".

## Running the server locally

```bash
script/server
```

You'll need the Airtable API Key and Base Key (available from the dxw 1Password).

### Access a ticket

Go to a ticket in Zendesk and append `?zat=true` to the url. eg:

```
https://dxw.zendesk.com/agent/tickets/123345?zat=true
```

Click on the `Apps` button on the ticket view to see the app in action!

## Running the tests

Run the following script:

```
script/test
```

## Building and updating the app

To rebuild the app locally following changes, run

```
script/build
```

to build the app in the `/dist` folder using [Webpack](https://webpack.js.org/), and generate a zip file of the
project in `dist/tmp`.

The repo is set up to automatically push to Zendesk on every `master` push, but in case you want to
do this manually and push the updated package to Zendesk, you can run:

```
script/build --push
```

This assumes you have the correct credentials in your `.zat` file.

### Adding new fields

When adding new fields, these are the files you will need to look at:
`default.js`, `project.js`

For the relating spec changes:
`app.spec.js`, `project.spec.js`

`my-project.json` is the test data used within the spec files.
