const stubJSON = function(filename) {
  return new Promise((resolve) => {
    var json = require('../fixtures/'+ filename +'.json')
    resolve(json)
  })
}

export const CLIENT = {
  _origin: 'zendesk.com',
  get: (prop) => {
    if (prop === 'ticket.customField:custom_field_21915476') {
      return Promise.resolve({
        'ticket.customField:custom_field_21915476': 'my-project'
      })
    }
    return Promise.resolve({
      [prop]: null
    })
  },
  metadata: () => {
    return Promise.resolve({
      settings: {
        airtable_api_key: '123',
        airtable_base_id: 'abc'
      }
    })
  },
  invoke: () => {}
}

export const AIRTABLE_BASE = {
  async findProjectBySlug(slug) {
    var result = await stubJSON(slug)
    return result[0]
  },
  async clients() {
    return await stubJSON('clients')
  },
  async hostingLocations() {
    return await stubJSON('hosting_locations')
  },
  async people() {
    return await stubJSON('people')
  },
  async gitRepositories() {
    return await stubJSON('git_repositories')
  },
  async slackChannels() {
    return await stubJSON('slack_channels')
  }
}

export const AIRTABLE_WITH_NO_PROJECT = {
  async findProjectBySlug(slug) {
    return null
  }
}
