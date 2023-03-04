const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)
const messages = []

module.exports = {
  createText: async request => {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: request,
        temperature: 0,
        max_tokens: 250,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: ['AI:', 'Human:']
      })

      return response.data.choices[0].text.trim()
    } catch (err) {
      return err
    }
  },
  createImage: async request => {
    try {
      const response = await openai.createImage({
        prompt: request,
        n: 1,
        size: "1024x1024",
      })

      return response.data.data[0].url
    } catch (err) {
      return err
    }
  },
  createChat: async request => {
    try {
      messages.push({
        'role': 'user',
        'content': request
      })
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.6
      })
      messages.push(response.data.choices[0].message)

      return response.data.choices[0].message.content.trim()
    } catch (err) {
      return err
    }
  },
  deleteMessage: () => {
    try {
      messages.splice(0, messages.length)
      return 'clear your all messages history!'
    } catch (err) {
      return err
    }
  }
}
