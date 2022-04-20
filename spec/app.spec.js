/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
import Project from '../src/javascripts/lib/project.js'

import { CLIENT, AIRTABLE_BASE, AIRTABLE_WITH_NO_PROJECT } from './mocks/mock'
import createRangePolyfill from './polyfills/createRange'

if (!document.createRange) {
  createRangePolyfill()
}

describe('Example App', () => {
  let app
  let project

  describe('Initialization Failure', () => {
    beforeEach(async () => {
      document.body.innerHTML = '<section data-main><img class="loader" src="spinner.gif"/></section>'
      jest.spyOn(CLIENT, 'metadata').mockReturnValueOnce(Promise.reject(new Error('a fake error')))

      app = new App(CLIENT)

      await app.initializePromise
    })

    afterEach(() => {
      CLIENT.metadata.mockRestore()
    })

    it('should show an error message on the page', () => {
      expect(document.querySelector('#project_wisdom')).not.toBe(null)
      expect(document.querySelector('#project_wisdom').textContent).toMatch('An error occurred')
    })
  })

  describe('Initialization Success', () => {
    beforeEach(async () => {
      document.body.innerHTML = '<section data-main><img class="loader" src="spinner.gif"/></section>'
      App.prototype._airtableBase = jest.fn(() => {
        return AIRTABLE_BASE
      })
      app = new App(CLIENT)
      project = await Project.init(AIRTABLE_BASE, 'my-project')

      await app.initializePromise
    })

    it('initialize a project', () => {
      expect(app.states.project.project_name).toEqual('My amazing project')
    })

    it('should display the project data', () => {
      const projectWisdom = document.querySelector('#project_wisdom')

      expect(projectWisdom).not.toBe(null)
      expect(projectWisdom.querySelector('h2').textContent).toBe(project.project_name)
      expect(projectWisdom.querySelector('.runbook_url').innerHTML).toMatch(project.runbook_url)
      expect(projectWisdom.querySelector('.wisdom_url').innerHTML).toMatch(project.wisdom_url)

      expect(projectWisdom.querySelector('.client').textContent).toMatch(project.clients)
      expect(projectWisdom.querySelector('.maintenance_status').textContent).toMatch(project.maintenance_status)
      expect(projectWisdom.querySelector('.hosting_location').textContent).toMatch(project.hosting_location)
      expect(projectWisdom.querySelector('.developer_names').textContent).toMatch(project.developer_names)
      expect(projectWisdom.querySelector('.dns_management').textContent).toMatch(project.dns_management)
      expect(projectWisdom.querySelector('.account_manager').textContent).toMatch(project.account_manager)

      expect(projectWisdom.querySelector('.url_0').innerHTML).toMatch(project.urls[0].Domain)
      expect(projectWisdom.querySelector('.url_0').innerHTML).toMatch('Staging')
      expect(projectWisdom.querySelector('.url_1').innerHTML).toMatch(project.urls[1].Domain)
      expect(projectWisdom.querySelector('.url_1').innerHTML).toMatch('Production')

      expect(projectWisdom.querySelector('.git_repository_0').innerHTML).toMatch('GitHub repository')
      expect(projectWisdom.querySelector('.git_repository_0').innerHTML).toMatch(project.git_repositories[0].URL)
      expect(projectWisdom.querySelector('.git_repository_0').innerHTML).toMatch(project.git_repositories[0].Repository)

      expect(projectWisdom.querySelector('.git_repository_1').innerHTML).toMatch('GovPress git repository')
      expect(projectWisdom.querySelector('.git_repository_1').innerHTML).toMatch(project.git_repositories[1].URL)
      expect(projectWisdom.querySelector('.git_repository_1').innerHTML).toMatch(project.git_repositories[1].Repository)

      expect(projectWisdom.querySelector('.slack_channel_0').innerHTML).toMatch(project.slack_channels[0]['Slack Link'])
      expect(projectWisdom.querySelector('.slack_channel_0').innerHTML).toMatch(project.slack_channels[0].Name)

      expect(projectWisdom.querySelector('.slack_channel_1').innerHTML).toMatch(project.slack_channels[1]['Slack Link'])
      expect(projectWisdom.querySelector('.slack_channel_1').innerHTML).toMatch(project.slack_channels[1].Name)
      expect(projectWisdom.querySelector('.slack_channel_1').innerHTML).toMatch(project.slack_channels[1].Description)

      expect(projectWisdom.querySelector('.trello_url').innerHTML).toMatch(project.trello_url)
      expect(projectWisdom.querySelector('.drive_url').innerHTML).toMatch(project.drive_url)
      expect(projectWisdom.querySelector('.last_reviewed').innerHTML).toMatch(project.last_reviewed)
    })
  })

  describe('when project is not present', () => {
    beforeEach(async () => {
      document.body.innerHTML = '<section data-main><img class="loader" src="spinner.gif"/></section>'
      App.prototype._airtableBase = jest.fn(() => {
        return AIRTABLE_WITH_NO_PROJECT
      })
      app = new App(CLIENT)

      await app.initializePromise
    })

    it('should show an error message on the page', () => {
      expect(document.querySelector('#project_wisdom')).not.toBe(null)
      expect(document.querySelector('#project_wisdom').textContent).toMatch('Project not found')
    })
  })
})
