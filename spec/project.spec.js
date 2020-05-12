import Project from '../src/javascripts/lib/project.js'
import { AIRTABLE_BASE } from './mocks/mock'

describe('project.js', async () => {
  let project

  beforeEach(async () => {
    project = await Project.init(AIRTABLE_BASE, 'my-project')
  })

  it('returns the Airtable URL', () => {
    expect(project.airtable_url).toEqual('https://airtable.com/tblne7bw5jfACz2XB/viwF0lQjetG2ICuO2/123')
  })

  it('returns project data', () => {
    expect(project.project_name).toEqual('My amazing project')
  })

  it('returns client names', () => {
    expect(project.clients).toEqual('Bruce Wayne')
  })

  it('returns a hosting location', () => {
    expect(project.hosting_location).toEqual('The Batcave')
  })

  it('returns developer names', () => {
    expect(project.developer_names).toEqual('The Joker, The Riddler')
  })

  it('returns git repositories', () => {
    expect(project.git_repositories).toEqual([
      {
        'Domain': 'github.com',
        'URL': 'https://github.com/foo/bar',
        'Repository': 'foo/bar'
      },
      {
        'Domain': 'git.govpress.com',
        'URL': 'https://git.govpress.com/bar/foo',
        'Repository': 'bar/foo'
      }
    ])
  })

  it('returns slack channels', () => {
    expect(project.slack_channels).toEqual([
      {
        'Slack Link': 'http://amazing.slack.com/1234',
        'Name': 'Something'
      },
      {
        'Slack Link': 'http://amazing.slack.com/456',
        'Name': 'Something Else',
        'Description': 'Some Description'
      }
    ])
  })
})
