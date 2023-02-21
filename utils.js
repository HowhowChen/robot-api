const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

module.exports = {
  createText: async request => {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: request,
        temperature: 0,
        max_tokens: 300,
      })

      return response.data.choices[0].text.split('\n\n')[1]
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
  }
}
