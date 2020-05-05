const stubJSON = function(filename) {
  return new Promise((resolve) => {
    var json = require('../fixtures/'+ filename +'.json')
    resolve(json)
  })
}

export const findProjectBySlug = function(slug) {
  return jest.fn(() => {
    return stubJSON(slug);
  })
}

export const clients = jest.fn(() => {
  return stubJSON('clients')
})

export const hostingLocations = jest.fn(() => {
  return stubJSON('hosting_locations')
})

export const people = jest.fn(() => {
  return stubJSON('people')
})

export const gitRepositories = jest.fn(() => {
  return stubJSON('git_repositories')
})

export const slackChannels = jest.fn(() => {
  return stubJSON('slack_channels')
})
