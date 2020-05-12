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

## Building a new version

Run the following command:

```
./script/build
```

This builds the Javascript using [Webpack](https://webpack.js.org/), and generates a zip file of the
project in `dist/tmp`.

## Updating the app

Run the following command:

```
./script/build --push
```

You will be prompted for a password, which is available in the dxw 1Password as "Zendesk API Key".
