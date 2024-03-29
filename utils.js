// Google Search
const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_API_KEY)

// OpenAI
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
  },
  locationSearch: async request => {
    try {
      const params = {
        q: request,
        location: "taiwan",
        tbm: "lcl"
      }
      
      const locations = new Promise((resolve, reject) => {
        search.json(params, data => {
          //  按評價高低排序
          data["local_results"].sort((a, b) => b.rating - a.rating)
          resolve(data["local_results"].slice(0, 5))
        })
      })

      return await locations
    } catch (err) {
      return err
    }
  },
  imageSearch: async request => {
    try {
      
      const params = {
        q: request,
        tbm: 'isch'
      }

      const images = new Promise((resolve, reject) => {
        search.json(params, data => {
          resolve(data["images_results"].slice(0, 5))
        })
      })

      return await images
    } catch (err) {
      return err
    }
  }
}
