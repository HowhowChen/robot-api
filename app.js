if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const port = 3001
const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

app.get('/', async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "who are you?",
      temperature: 0,
      max_tokens: 7,
    })
    res.status(200).json({
      data: response.data.choices[0].text
    })
  } catch (err) {
    console.log(err)
  }
})

app.listen(port, () => console.log(`The server is listening on http://localhost${port}`))
