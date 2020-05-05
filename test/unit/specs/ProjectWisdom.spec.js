import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import ProjectWisdom from '@/components/ProjectWisdom'
import Client from '../../helpers/zaf_client'
import { findProjectBySlug, clients, hostingLocations, people, gitRepositories, slackChannels } from '../../helpers/airtable'

describe('ProjectWisdom.vue', () => {
  beforeEach(async () => {
    await flushPromises()
  })

  describe('when the project exists', () => {
    const wrapper = mount(ProjectWisdom, {
      data: function () {
        return {
          zafClient: Client
        }
      },
      methods: {
        findProjectBySlug: findProjectBySlug('project'),
        clients: clients,
        hostingLocations: hostingLocations,
        people: people,
        gitRepositories: gitRepositories,
        slackChannels: slackChannels
      }
    })

    it('should render correct contents', () => {
      expect(wrapper.find('#project_wisdom h2').text()).toEqual('My amazing project')
      expect(wrapper.find('#project_wisdom .maintenance_status').text()).toMatch('Active')
      expect(wrapper.find('#project_wisdom .last_reviewed').text()).toMatch('This information last reviewed 2020-01-01')
      expect(wrapper.find('#project_wisdom .client').text()).toMatch('Bruce Wayne')
      expect(wrapper.find('#project_wisdom .hosting_location').text()).toMatch('The Batcave')
      expect(wrapper.find('#project_wisdom .developer_names').text()).toMatch('The Joker, The Riddler')
      expect(wrapper.find('#project_wisdom .wisdom_url').html()).toMatch('http://example.com')
      expect(wrapper.find('#project_wisdom .trello_url').html()).toMatch('http://trello.com/1234')

      expect(wrapper.find('#project_wisdom .project_links').html()).toMatch('https://github.com/foo/bar')
      expect(wrapper.find('#project_wisdom .project_links').html()).toMatch('https://git.govpress.com/bar/foo')
      expect(wrapper.find('#project_wisdom .project_links').html()).toMatch('http://amazing.slack.com/1234')
      expect(wrapper.find('#project_wisdom .project_links').html()).toMatch('http://amazing.slack.com/456')

      expect(wrapper.find('#project_wisdom .drive_url').html()).toMatch('http://drive.google.com/1234')
    })
  })

  describe('when the project does not exist', () => {
    const wrapper = mount(ProjectWisdom, {
      data: function () {
        return {
          zafClient: Client
        }
      },
      methods: {
        findProjectBySlug: findProjectBySlug('no_project')
      }
    })

    it('should show an error message', () => {
      expect(wrapper.find('#project_wisdom').text()).toMatch('Project not found')
    })
  })

  describe('findObjectsByIDs', () => {
    it('should filter by ID', async () => {
      var objectList = function () {
        return new Promise((resolve) => {
          resolve([
            {
              id: '1234'
            },
            {
              id: '5678'
            }
          ])
        })
      }
      var results = await ProjectWisdom.methods.findObjectsByIDs(objectList(), ['1234'])

      expect(results).toEqual([
        {
          id: '1234'
        }
      ])
    })
  })

  describe('getClientNames', function () {
    it('lists names', async () => {
      ProjectWisdom.methods.clients = function () { }
      ProjectWisdom.methods.findObjectsByIDs = function () {
        return new Promise((resolve) => {
          resolve([
            {
              fields: {
                'Name': 'Bruce Wayne'
              }
            },
            {
              fields: {
                'Name': 'Dick Grayson'
              }
            }
          ])
        })
      }
      var names = await ProjectWisdom.methods.getClientNames()

      expect(names).toEqual('Bruce Wayne, Dick Grayson')
    })
  })

  describe('getHostingLocationName', function () {
    it('gets the name of the first location', async () => {
      ProjectWisdom.methods.hostingLocations = function () { }
      ProjectWisdom.methods.findObjectsByIDs = function () {
        return new Promise((resolve) => {
          resolve([
            {
              fields: {
                'Name': 'The Batcave'
              }
            }
          ])
        })
      }

      var name = await ProjectWisdom.methods.getHostingLocationName()

      expect(name).toEqual('The Batcave')
    })
  })
})
