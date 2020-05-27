const Airtable = require('airtable')

class AirtableBase {
  constructor (apiKey, baseID) {
    this._base = new Airtable({ apiKey: apiKey }).base(baseID)
  }

  async findProjectBySlug (slug) {
    var result = await this._base('Projects').select({
      filterByFormula: '({Zendesk Slug}="' + slug + '")'
    }).all()

    return result[0]
  }

  async clients () {
    return this._base('Clients').select().all()
  }

  async hostingLocations () {
    return this._base('Hosting Locations').select().all()
  }

  async people () {
    return this._base('People').select().all()
  }

  async gitRepositories () {
    return this._base('Repositories').select().all()
  }

  async slackChannels () {
    return this._base('Slack Channels').select().all()
  }
}

export default AirtableBase
