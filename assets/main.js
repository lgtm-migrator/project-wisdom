"use strict";

var Airtable = require('airtable');

var app = new Vue({
  el: '#app',
  data: {
    project_name: null,
    project_clients: null,
    maintenance_status: null,
    hosting_location: null,
    developer_names: null,
    github_url: null,
    slack_url: null,
    base: null,
    error_message: null,
    isLoading: true,
    clients: function() {
      return this.base('Clients').select().all()
    },
    hosting_locations: function() {
      return this.base('Hosting Locations').select().all()
    },
    people: function() {
      return this.base('People').select().all()
    }
  },
  created: function() {
    var app = this;
    var client = ZAFClient.init();
    var customFieldName = 'custom_field_21915476'
    var customFieldFinder = 'ticket.customField:' + customFieldName;
    var projectName;

    client.invoke('resize', { width: '100%', height: '250px' });

    client.metadata().then(function(metadata) {
      app.base = new Airtable({
        apiKey: metadata.settings.airtable_api_key
      }).base(metadata.settings.airtable_base_key);

      var promises = [];

      client.get(customFieldFinder).then(function(data) {
        var projectName = data[customFieldFinder];

        promises.push(app.findProjectBySlug(projectName).then(function(projectData) {
          if (projectData.length > 0) {
            var project = projectData[0];

            app.project_name = project.fields["Project Name"];

            if (project.fields["Client"]) {
              promises.push(app.getClientNames(project.fields["Client"]).then(function(clientNames) {
                app.project_clients = clientNames;
              }));
            }

            if (project.fields["Hosted On"]) {
              promises.push(app.getHostingLocationName(project.fields["Hosted On"]).then(function(hostingLocation) {
                app.hosting_location = hostingLocation;
              }))
            }

            if (project.fields["Developers"]) {
              promises.push(app.getPeople(project.fields["Developers"]).then(function(developers) {
                app.developer_names = developers;
              }));
            }

            app.maintenance_status = project.fields["Maintenance Status"];
            app.github_url = project.fields["GitHub URL"];
            app.slack_url = project.fields["Slack Link"];
          } else {
           app.error_message = "Project not found"
          }
        }))
      }).then(function() {
        Promise.all(promises).then(function() {
          app.isLoading = false;
        });
      });
    });
  },
  methods: {
    findProjectBySlug: function(projectName) {
      return this.base('Projects').select({
        filterByFormula: '({Zendesk Slug}="' + projectName + '")'
      }).all();
    },
    findObjectsByIDs: function(object_list, ids) {
      return object_list.then(function(objects) {
        return ids.map(function(id) {
          return objects.find(function(client) {
            return client.id == id;
          })
        })
      });
    },
    getClientNames: function(ids) {
      var clients = this.clients();

      return this.findObjectsByIDs(clients, ids).then(function(result) {
        return result.map(function(client) {
          return client.fields["Name"];
        }).join(", ");
      });
    },
    getHostingLocationName: function(id) {
      var hosting_locations = this.hosting_locations();

      return this.findObjectsByIDs(hosting_locations, [id]).then(function(result) {
        return result[0].fields["Name"];
      });
    },
    getPeople: function(ids) {
      var people = this.people();

      return this.findObjectsByIDs(people, ids).then(function(result) {
        return result.map(function(client) {
          return client.fields["Name"];
        }).join(", ");
      });
    }
  }
})
