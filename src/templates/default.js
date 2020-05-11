import { templatingLoop as loop, escapeSpecialChars as escape } from '../javascripts/lib/helpers.js'
import I18n from '../javascripts/lib/i18n.js'
const Handlebars = require('handlebars')

Handlebars.registerHelper('eq', (a, b, opts) => {
  if(a === b) {
    return true
  } else {
    return false
  }
});

export default function (args) {
  var template = Handlebars.compile(`
  <div id="project_wisdom">
    {{#if error_message}}
    <p>{{ error_message }}</p>
    {{else}}
    <h2 class="u-semibold u-fs-lg">{{ project.project_name }}</h2>

    <ul class="u-mv-sm">
      {{#if project.wisdom_url}}
      <li class="wisdom_url">
        <strong><i class="fas fa-fw fa-brain"></i> <a href="{{project.wisdom_url}}" target="_blank">Read the Project Wisdom</a></strong>
      </li>
      {{/if}}
      {{#if project.production_url}}
      <li class="production_url">
        <strong><i class="fas fa-fw fa-globe"></i> <a href={{ project.production_url }} target="_blank">View Production</a></strong>
      </li>
      {{/if}}
      {{#if project.staging_url}}
      <li class="staging_url">
        <strong><i class="fas fa-fw fa-flask"></i> <a href={{ project.staging_url }} target="_blank">View Production</a></strong>
      </li>
      {{/if}}
    </ul>

    <ul class="u-mv-sm">
    {{#if project.clients}}
      <li class="client">
        <strong>Client</strong><br>
        {{ project.clients }}
      </li>
    {{/if}}
    {{#if project.maintenance_status}}
      <li class="maintenance_status">
        <strong>Maintenance Status</strong><br>
        {{ project.maintenance_status }}
      </li>
    {{/if}}
    {{#if project.hosting_location}}
      <li class="hosting_location">
        <strong>Hosting Location</strong><br>
        {{ project.hosting_location }}
      </li>
    {{/if}}
    {{#if project.developer_names}}
      <li class="developer_names">
        <strong>Developers</strong><br>
        {{ project.developer_names }}
      </li>
    {{/if}}
    </ul>

    <div class="links u-mv-sm u-pv-sm u-border-t">
      <ul>
        {{#each project.git_repositories}}
        <li class="git_repository_{{@index}}">
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
          <li class="slack_channel_{{@index}}">
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
        <li class="trello_url">
          <i class="fab fa-fw fa-trello"></i> <a href="{{project.trello_url}}" target="_blank">Trello board</a>
        </li>
        {{/if}}
        {{#if project.drive_url}}
        <li class="drive_url">
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
