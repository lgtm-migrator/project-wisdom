const stubJSON = function (filename) {
  return new Promise((resolve) => {
    const json = require('../fixtures/' + filename + '.json')
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
  async findProjectBySlug (slug) {
    const result = await stubJSON(slug)
    return result[0]
  },
  async clients () {
    return stubJSON('clients')
  },
  async hostingLocations () {
    return stubJSON('hosting_locations')
  },
  async people () {
    return stubJSON('people')
  },
  async gitRepositories () {
    return stubJSON('git_repositories')
  },
  async slackChannels () {
    return stubJSON('slack_channels')
  },
  async urls () {
    return stubJSON('urls')
  }
}

export const AIRTABLE_WITH_NO_PROJECT = {
  async findProjectBySlug (slug) {
    return null
  }
}
