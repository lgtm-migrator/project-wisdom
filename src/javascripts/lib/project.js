class Project {
  static async init(airtableBase, slug) {
    var data = await airtableBase.findProjectBySlug(slug)
    if (data) {
      var project = new Project(airtableBase, data)
      await project.initializeFields()
      return project
    } else {
      return null
    }
  }

  constructor(airtableBase, data) {
    this._id = data.id
    this._fields = data.fields
    this._base = airtableBase
  }

  async initializeFields() {
    this.airtable_url = 'https://airtable.com/tblne7bw5jfACz2XB/viwF0lQjetG2ICuO2/' + this.id
    this.project_name = this._fields['Project Name']
    this.maintenance_status = this._fields['Maintenance Status']
    this.last_reviewed = this._fields['Record last reviewed']
    this.clients = await this._clientNames()
    this.hosting_location = await this._hostingLocation()
    this.developer_names = await this._developerNames()
    this.git_repositories = await this._gitRepositories()
    this.slack_channels = await this._slackChannels()
    this.wisdom_url = this._fields['Project Wisdom']
    this.production_url = this._fields['Production URL']
    this.staging_url = this._fields['Staging URL']
    this.slack_url = this._fields['Slack Link']
    this.trello_url = this._fields['Trello Board']
    this.drive_url = this._fields['Google Drive Folder']
  }

  async _clientNames() {
    var clients = await this._findObjectsByIDs(
      this._base.clients(),
      this._fields['Client']
    )

    return clients.map(function (client) {
      return client.fields['Name']
    }).join(', ')
  }

  async _hostingLocation() {
    var hostingLocations = await this._findObjectsByIDs(
      this._base.hostingLocations(),
      this._fields['Hosted On']
    )

    if (hostingLocations.length > 0) {
      return hostingLocations[0].fields['Name']
    }
  }

  async _developerNames() {
    var developers = await this._findObjectsByIDs(
      this._base.people(),
      this._fields['Developers']
    )

    return developers.map(function (developer) {
      return developer.fields['Name']
    }).join(', ')
  }

  async _gitRepositories() {
    var gitRepositories = await this._findObjectsByIDs(
      this._base.gitRepositories(),
      this._fields['Git Repositories']
    )

    return gitRepositories.map(function (repository) {
      return repository.fields
    })
  }

  async _slackChannels() {
    var slackChannels = await this._findObjectsByIDs(
      this._base.slackChannels(),
      this._fields['Slack Channels']
    )

    return slackChannels.map(function (channel) {
      return channel.fields
    })
  }

  async _findObjectsByIDs(objectList, ids) {
    if (ids) {
      var objects = await objectList

      return ids.map(function (id) {
        return objects.find(function (client) {
          return client.id === id
        })
      })
    } else {
      return []
    }
  }
}

export default Project


