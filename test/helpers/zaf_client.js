const Client = jest.genMockFromModule('zendesk_app_framework_sdk/lib/client')

Client.invoke = jest.fn((command, args) => true)
Client.metadata = jest.fn(() => {
  return new Promise((resolve) => {
    resolve({
      settings: {
        airtable_api_key: 'abc',
        airtable_base_id: 123
      }
    })
  })
})
Client.get = jest.fn((finder) => {
  return new Promise((resolve) => {
    var data = {}
    data[finder] = 'foo'
    resolve(data)
  })
})

export default Client
