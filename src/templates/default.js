const Handlebars = require('handlebars')

Handlebars.registerHelper('eq', (a, b, opts) => {
  if (a === b) {
    return true
  } else {
    return false
  }
})

export default function (args) {
  const template = Handlebars.compile(`
  <div id="project_wisdom">
    {{#if error_message}}
    <p>{{ error_message }}</p>
    {{else}}
    <h2 class="u-semibold u-fs-lg">{{ project.project_name }}</h2>

    <ul class="u-mv-sm">
      {{#if project.runbook_url}}
      <li class="pw_list_item pw_list_item__url runbook_url">
        <i class="fas fa-fw fa-book"></i> <b><a href="{{project.runbook_url}}" target="_blank">Support Runbook</a></b>
      </li>
      {{/if}}
      {{#if project.wisdom_url}}
      <li class="pw_list_item pw_list_item__url wisdom_url">
        <i class="fas fa-fw fa-brain"></i> <b><a href="{{project.wisdom_url}}" target="_blank">Project Wisdom</a></b>
      </li>
      {{/if}}
      {{#each project.urls}}
      <li class="pw_list_item pw_list_item__url url_{{@index}}">

          {{#if (eq this.Type "Production") }}
            <i class="fas fa-fw fa-rocket"></i>
          {{else if (eq this.Type "Staging") }}
            <i class="fas fa-fw fa-flask"></i>
          {{else}}
            <i class="fas fa-fw fa-globe"></i>
          {{/if}}

        <a href={{ this.URL }} target="_blank"><b>{{ lookup this 'Friendly Name' }}<br></b><small>{{ lookup this 'Display Domain' }}</small></a>
      </li>
      {{/each}}
    </ul>

    <ul class="u-mv-sm">
    {{#if project.clients}}
      <li class="pw_list_item pw_list_item__field client">
        <b>Client:</b><br>
        {{ project.clients }}
      </li>
    {{/if}}
    {{#if project.maintenance_status}}
      <li class="pw_list_item pw_list_item__field maintenance_status">
        <b>Maintenance Status:</b><br>
        {{ project.maintenance_status }}
      </li>
    {{/if}}
    {{#if project.hosting_location}}
      <li class="pw_list_item pw_list_item__field hosting_location">
        <b>Hosting Location:</b><br>
        {{ project.hosting_location }}
      </li>
    {{/if}}
    {{#if project.developer_names}}
      <li class="pw_list_item pw_list_item__field developer_names">
        <b>Developers:</b><br>
        {{ project.developer_names }}
      </li>
    {{/if}}
    {{#if project.dns_management}}
      <li class="pw_list_item pw_list_item__field dns_management">
        <b>DNS Management:</b><br>
        {{ project.dns_management }}
      </li>
    {{/if}}
    {{#if project.account_manager}}
      <li class="pw_list_item pw_list_item__field account_manager">
        <b>Account Manager:</b><br>
        {{ project.account_manager }}
      </li>
    {{/if}}
    </ul>

    <div class="links u-mv-sm u-pv-sm u-border-t">
      <ul>
        {{#each project.git_repositories}}
        <li class="pw_list_item pw_list_item__extended git_repository_{{@index}}">
          {{#if (eq this.Domain 'github.com')}}
            <i class="fab fa-fw fa-github" title="GitHub repository"></i>
          {{/if}}
          {{#if (eq this.Domain 'git.govpress.com')}}
            <i class="fab fa-fw fa-gitlab" title="GovPress git repository"></i>
          {{/if}}
          <a href="{{ this.URL }}" target="_blank">{{ this.Repository }}</a>
        </li>
        {{/each}}
        {{#each project.slack_channels}}
          <li class="pw_list_item pw_list_item__extended slack_channel_{{@index}}">
            <i class="fab fa-fw fa-slack" title="Slack channel"></i>
            <a href="{{ lookup this 'Slack Link' }}" target="_blank">
              #{{ this.Name }}
              {{#if this.Description }}
              ({{ this.Description }})
              {{/if}}
            </a>
          </li>
        {{/each}}
        {{#if project.trello_url}}
        <li class="pw_list_item pw_list_item__extended trello_url">
          <i class="fab fa-fw fa-trello"></i> <a href="{{project.trello_url}}" target="_blank">Trello board</a>
        </li>
        {{/if}}
        {{#if project.drive_url}}
        <li class="pw_list_item pw_list_item__extended drive_url">
          <i class="fab fa-fw fa-google-drive"></i> <a href="{{project.drive_url}}" target="_blank">Google Drive folder</a>
        </li>
        {{/if}}
      </ul>
      <div class="u-mv-sm u-pv-sm u-border-t last_reviewed">
        <p><i class="fas fa-fw fa-info-circle"></i> <a href="{{project.airtable_url}}" target="_blank">See this project on AirTable</a></p>
        {{#if project.last_reviewed}}
        <p><small>This information last reviewed {{ project.last_reviewed }}.</small></p>
        {{else}}
        <p><b>This information has not yet been marked as reviewed.</b> Maybe you could go do it?</p>
        {{/if}}
      </div>
    </div>
    {{/if}}
  </div>
  `)

  return template(args)
}
