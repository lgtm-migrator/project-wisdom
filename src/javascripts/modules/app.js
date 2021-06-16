/**
 *  Example app
 **/

import { resizeContainer, render } from '../../javascripts/lib/helpers'
import getDefaultTemplate from '../../templates/default'
import AirtableBase from '../lib/airtable_base'
import Project from '../../javascripts/lib/project'

const MAX_HEIGHT = 1000

class App {
  constructor (client) {
    this._client = client
    this._customFieldFinder = 'ticket.customField:custom_field_21915476'
    this.states = {}

    // this.initializePromise is only used in testing
    // indicate app initilization(including all async operations) is complete
    this.initializePromise = this.init()
  }

  /**
   * Initialize module, render main template
   */
  async init () {
    let project
    const metadata = await this._client.metadata().catch(this._handleError.bind(this))

    if (metadata) {
      project = await this.initializeProject(metadata.settings).catch(this._handleError.bind(this))
    }

    if (project) {
      this.states.project = project
    } else {
      this.states.error_message = this.states.error_message || 'Project not found'
    }

    this._renderTemplate()
    return resizeContainer(this._client, MAX_HEIGHT)
  }

  async initializeProject (settings) {
    const data = await this._client.get(this._customFieldFinder)
    const projectName = data[this._customFieldFinder]
    const project = await Project.init(
      this._airtableBase(settings.airtable_api_key, settings.airtable_base_id),
      projectName
    )

    return project
  }

  _airtableBase (apiKey, baseID) {
    return new AirtableBase(apiKey, baseID)
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError (error) {
    console.log(error)
    this.states.error_message = 'An error occurred'
  }

  _renderTemplate () {
    render('.loader', getDefaultTemplate(this.states))
  }
}

export default App
