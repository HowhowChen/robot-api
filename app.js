if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000
const linebot = require('linebot');
const { createText, createImage } = require('./utils');
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 當有人傳送訊息給Bot時
bot.on('message', async event => {
  // event.message.text是使用者傳給bot的訊息
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
  const textType = event.message.type
  if (textType !== 'text') return

  const textArr = event.message.text.split('') 
  switch (textArr[0]) {
    //  文字對話
    case 'C':
      //  扣除陣列中字首
      textArr.splice(0, 1)

      // 展開陣列並去除空白
      newText = textArr.join('').trim()

      // 呼叫OPENAI API
      const replyMsg = await createText(newText)
      event.reply(replyMsg)
        .then(data => {
          // 當訊息成功回傳後的處理
        })
        .catch(error => {
          // 當訊息回傳失敗後的處理
          console.log(error)
        })
    //  圖片
    case 'P':
      //  扣除陣列中字首
      textArr.splice(0, 1)

      // 展開陣列並去除空白
      newText = textArr.join('').trim()
      
      // 呼叫OPENAI API
      const replyImage = await createImage(newText)

      event.reply({
        type: 'image',
        originalContentUrl: replyImage,
        previewImageUrl: replyImage
      })
        .then(data => {
          // 當訊息成功回傳後的處理
        })
        .catch(error => {
          // 當訊息回傳失敗後的處理
          console.log(error)
        })
    default:
      return
  }
})

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', port, function () {
    console.log('Bot is already!')
})