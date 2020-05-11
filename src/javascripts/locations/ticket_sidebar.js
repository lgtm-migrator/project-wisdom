import App from '../modules/app'
import Project from '../lib/project'

/* global ZAFClient */
var client = ZAFClient.init()

client.on('app.registered', function () {
  return new App(client)
})
