const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

module.exports = {
  response: async request => {
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
  }
}