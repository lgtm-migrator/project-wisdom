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
    beforeEach((done) => {
      document.body.innerHTML = '<section data-main><img class="loader" src="spinner.gif"/></section>'
      jest.spyOn(CLIENT, 'metadata').mockReturnValueOnce(Promise.reject(new Error('a fake error')))

      app = new App(CLIENT)

      app.initializePromise.then(() => {
        done()
      })
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
    beforeEach(async (done) => {
      document.body.innerHTML = '<section data-main><img class="loader" src="spinner.gif"/></section>'
      App.prototype._airtableBase = jest.fn(() => {
        return AIRTABLE_BASE
      })
      app = new App(CLIENT)
      project = await Project.init(AIRTABLE_BASE, 'my-project')

      app.initializePromise.then(() => {
        done()
      })
    })

    it('initialize a project', () => {
      expect(app.states.project.project_name).toEqual('My amazing project')
    })

    it('should display the project data', () => {
      expect(document.querySelector('#project_wisdom')).not.toBe(null)
      expect(document.querySelector('#project_wisdom h2').textContent).toBe(project.project_name)
      expect(document.querySelector('#project_wisdom .wisdom_url').innerHTML).toMatch(project.wisdom_url)

      expect(document.querySelector('#project_wisdom .client').textContent).toMatch(project.clients)
      expect(document.querySelector('#project_wisdom .maintenance_status').textContent).toMatch(project.maintenance_status)
      expect(document.querySelector('#project_wisdom .hosting_location').textContent).toMatch(project.hosting_location)
      expect(document.querySelector('#project_wisdom .developer_names').textContent).toMatch(project.developer_names)

      expect(document.querySelector('#project_wisdom .git_repository_0').innerHTML).toMatch('GitHub repository')
      expect(document.querySelector('#project_wisdom .git_repository_0').innerHTML).toMatch(project.git_repositories[0]['URL'])
      expect(document.querySelector('#project_wisdom .git_repository_0').innerHTML).toMatch(project.git_repositories[0]['Repository'])

      expect(document.querySelector('#project_wisdom .git_repository_1').innerHTML).toMatch('GovPress git repository')
      expect(document.querySelector('#project_wisdom .git_repository_1').innerHTML).toMatch(project.git_repositories[1]['URL'])
      expect(document.querySelector('#project_wisdom .git_repository_1').innerHTML).toMatch(project.git_repositories[1]['Repository'])

      expect(document.querySelector('#project_wisdom .slack_channel_0').innerHTML).toMatch(project.slack_channels[0]['Slack Link'])
      expect(document.querySelector('#project_wisdom .slack_channel_0').innerHTML).toMatch(project.slack_channels[0]['Name'])

      expect(document.querySelector('#project_wisdom .slack_channel_1').innerHTML).toMatch(project.slack_channels[1]['Slack Link'])
      expect(document.querySelector('#project_wisdom .slack_channel_1').innerHTML).toMatch(project.slack_channels[1]['Name'])
      expect(document.querySelector('#project_wisdom .slack_channel_1').innerHTML).toMatch(project.slack_channels[1]['Description'])

      expect(document.querySelector('#project_wisdom .trello_url').innerHTML).toMatch(project.trello_url)
      expect(document.querySelector('#project_wisdom .drive_url').innerHTML).toMatch(project.drive_url)
      expect(document.querySelector('#project_wisdom .last_reviewed').innerHTML).toMatch(project.last_reviewed)
    })
  })

  describe('when project is not present', () => {
    beforeEach(async (done) => {
      document.body.innerHTML = '<section data-main><img class="loader" src="spinner.gif"/></section>'
      App.prototype._airtableBase = jest.fn(() => {
        return AIRTABLE_WITH_NO_PROJECT
      })
      app = new App(CLIENT)

      app.initializePromise.then(() => {
        done()
      })
    })

    it('should show an error message on the page', () => {
      expect(document.querySelector('#project_wisdom')).not.toBe(null)
      expect(document.querySelector('#project_wisdom').textContent).toMatch('Project not found')
    })
  })
})
