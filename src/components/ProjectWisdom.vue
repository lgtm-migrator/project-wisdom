<template>
  <div id="project_wisdom">
    <div v-if="isLoading">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:#fff;display:block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#1ba4de" stroke-width="4" r="15" stroke-dasharray="70.68583470577033 25.561944901923447">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.9803921568627451s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
        </circle>
      </svg>
    </div>

    <div v-if="!isLoading">
      <div v-if="projectData.error_message">
        <p>{{ projectData.error_message }}</p>
      </div>
      <div v-else>
        <h2 class="u-semibold u-fs-lg">{{ projectData.project_name }}</h2>

        <ul class="u-mv-sm">
          <li v-if="projectData.wisdom_url" class="wisdom_url">
            <strong>
              <i class="fas fa-fw fa-brain"></i>
              <a :href=projectData.wisdom_url target="_blank">Read the Project Wisdom</a>
            </strong>
          </li>
          <li v-if="projectData.production_url" class="production_url">
            <strong>
              <i class="fas fa-fw fa-globe"></i>
              <a :href=projectData.production_url target="_blank">View Production</a>
            </strong>
          </li>
          <li v-if="projectData.staging_url" class="production_url">
            <strong>
              <i class="fas fa-fw fa-flask"></i>
              <a :href=projectData.staging_url target="_blank">View Staging</a>
            </strong>
          </li>
        </ul>

        <ul class="u-mv-sm">
          <li v-if="projectData.project_clients" class="client">
            <strong>Client</strong><br>
            {{ projectData.project_clients }}
          </li>
          <li v-if="projectData.maintenance_status" class="maintenance_status">
            <strong>Maintenance Status</strong><br>
            {{ projectData.maintenance_status }}
          </li>
          <li v-if="projectData.hosting_location" class="hosting_location">
            <strong>Hosting Location</strong><br>
            {{ projectData.hosting_location }}
          </li>
          <li v-if="projectData.developer_names" class="developer_names">
            <strong>Developers</strong><br>
            {{ projectData.developer_names }}
          </li>
        </ul>

        <div class="links u-mv-sm u-pv-sm u-border-t">
          <ul class="project_links">
            <li v-for="repository in projectData.gitRepositories" :key="repository['Domain']">
              <i class="fab fa-fw fa-github" v-if="repository['Domain'] === 'github.com'" title="GitHub repository"></i>
              <i class="fab fa-fw fa-gitlab" v-else-if="repository['Domain'] === 'git.govpress.com'" title="GovPress git repository"></i>
              <a :href="repository['URL']" target="_blank">{{ repository["Repository"] }}</a>
            </li>
            <li v-for="channel in projectData.slackChannels" :key="channel['Name']">
              <i class="fab fa-fw fa-slack" title="Slack channel"></i>
              <a :href="channel['Slack Link']">#{{ channel["Name"] }}<span v-if="channel['Description']"> ({{ channel["Description"] }})</span></a>
            </li>
            <li v-if="projectData.trello_url">
              <a :href=projectData.trello_url target="_blank" class="trello_url">
                <i class="fab fa-fw fa-trello" title="View the project's Trello board"></i>
              </a>
            </li>
            <li v-if="projectData.drive_url">
              <a :href=projectData.drive_url target="_blank" class="drive_url">
                <i class="fab fa-fw fa-google-drive" title="View the project's folder on Google Drive"></i>
              </a>
            </li>
          </ul>

          <div class="u-mv-sm u-pv-sm u-border-t">
            <p><i class="fas fa-fw fa-info-circle"></i> <a :href=airtable_url target="_blank">See this project on AirTable</a></p>
            <p v-if="projectData.last_reviewed"><small class="last_reviewed">This information last reviewed {{ projectData.last_reviewed }}.</small></p>
            <p v-else><b>This information has not yet been marked as reviewed.</b> Maybe you could go do it?</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Airtable = require('airtable')
const ZAFClient = require('zendesk_app_framework_sdk')

export default {
  name: 'ProjectWisdom',
  data () {
    return {
      customFieldName: 'custom_field_21915476',
      customFieldFinder: 'ticket.customField' + this.customFieldName,
      projectData: {},
      isLoading: true,
      zafClient: ZAFClient.init()
    }
  },
  async created () {
    this.zafClient.invoke('resize', { width: '100%', height: '250px' })
    this.projectData = await this.getProjectData()
    this.isLoading = false
  },
  methods: {
    getProjectData: async function () {
      let projectData = {}
      let app = this

      let metadata = await app.zafClient.metadata()

      app.base = new Airtable({
        apiKey: metadata.settings.airtable_api_key
      }).base(metadata.settings.airtable_base_id)

      let data = await app.zafClient.get(app.customFieldFinder)
      let projectName = data[app.customFieldFinder]

      let results = await app.findProjectBySlug(projectName)

      if (results.length > 0) {
        var project = results[0]

        projectData.airtable_url = 'https://airtable.com/tblne7bw5jfACz2XB/viwF0lQjetG2ICuO2/' + project.id

        projectData.project_name = project.fields['Project Name']

        projectData.maintenance_status = project.fields['Maintenance Status']
        projectData.last_reviewed = project.fields['Record last reviewed']

        if (project.fields['Client']) {
          projectData.project_clients = await app.getClientNames(project.fields['Client'])
        }

        if (project.fields['Hosted On']) {
          projectData.hosting_location = await app.getHostingLocationName(project.fields['Hosted On'])
        }

        if (project.fields['Developers']) {
          projectData.developer_names = await app.getPeople(project.fields['Developers'])
        }

        if (project.fields['Git Repositories']) {
          projectData.gitRepositories = await app.getGitRepositories(project.fields['Git Repositories'])
        }

        if (project.fields['Slack Channels']) {
          projectData.slackChannels = await app.getSlackChannels(project.fields['Slack Channels'])
        }

        projectData.wisdom_url = project.fields['Project Wisdom']
        projectData.production_url = project.fields['Production URL']
        projectData.staging_url = project.fields['Staging URL']

        projectData.slack_url = project.fields['Slack Link']
        projectData.trello_url = project.fields['Trello Board']
        projectData.drive_url = project.fields['Google Drive Folder']
      } else {
        projectData.error_message = 'Project not found'
      }

      return projectData
    },
    findProjectBySlug: async function (projectName) {
      return this.base('Projects').select({
        filterByFormula: '({Zendesk Slug}="' + projectName + '")'
      }).all()
    },
    findObjectsByIDs: async function (objectList, ids) {
      var objects = await objectList

      return ids.map(function (id) {
        return objects.find(function (client) {
          return client.id === id
        })
      })
    },
    getClientNames: async function (ids) {
      var clients = await this.findObjectsByIDs(this.clients(), ids)
      var clientNames = clients.map(function (client) {
        return client.fields['Name']
      }).join(', ')

      return clientNames
    },
    getHostingLocationName: async function (id) {
      var hostingLocations = await this.findObjectsByIDs(this.hostingLocations(), id)

      if (hostingLocations.length > 0) {
        return hostingLocations[0].fields['Name']
      }
    },
    getPeople: async function (ids) {
      var people = await this.findObjectsByIDs(this.people(), ids)

      return people.map(function (client) {
        return client.fields['Name']
      }).join(', ')
    },
    getGitRepositories: async function (ids) {
      var gitRepositories = await this.findObjectsByIDs(this.gitRepositories(), ids)

      return gitRepositories.map(function (client) {
        return client.fields
      })
    },
    getSlackChannels: async function (ids) {
      var slackChannels = await this.findObjectsByIDs(this.slackChannels(), ids)

      return slackChannels.map(function (channel) {
        return channel.fields
      })
    },
    clients: function () {
      return this.base('Clients').select().all()
    },
    hostingLocations: function () {
      return this.base('Hosting Locations').select().all()
    },
    people: function () {
      return this.base('People').select().all()
    },
    gitRepositories: function () {
      return this.base('Repositories').select().all()
    },
    slackChannels: function () {
      return this.base('Slack Channels').select().all()
    }
  }
}
</script>
