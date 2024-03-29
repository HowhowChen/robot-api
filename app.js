if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000
const linebot = require('linebot');
const { createText, createImage, createChat, deleteMessage, locationSearch, imageSearch } = require('./utils');
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})
let timeStamp = 0 // 計數器

// 當有人傳送訊息給Bot時
bot.on('message', async event => {
  // event.message.text是使用者傳給bot的訊息
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
  const textType = event.message.type
  if (textType !== 'text') return
  const textArr = event.message.text.split('') 
  switch (textArr[0]) {
    // token is too expensive
    /*
    //  文字對話
    case 'C':
      //  扣除陣列中字首
      textArr.splice(0, 1)

      // 展開陣列並去除空白
      newText = textArr.join('').trim()

      // 呼叫OPENAI API
      const replyMsg = await createText(newText)
      event.reply({ type: 'text', text: replyMsg })
        .then(data => {
          // 當訊息成功回傳後的處理
        })
        .catch(error => {
          // 當訊息回傳失敗後的處理
          console.log(error)
        })
      break
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
        break
    */
    case 'G':
      timeStamp += 1
      if (timeStamp >= 20) {
        // 刪除歷史紀錄,計數器歸零
        timeStamp = 0
        event.reply({ type: 'text', text: await deleteMessage() })
        return
      }

      //  扣除陣列中字首
      textArr.splice(0, 1)

      // 展開陣列並去除空白
      newText = textArr.join('').trim()

      // 呼叫OPENAI API
      const replyChat = await createChat(newText)
      
      event.reply({ type: 'text', text: replyChat })
        .then(data => {
          // 當訊息成功回傳後的處理
        })
        .catch(error => {
          // 當訊息回傳失敗後的處理
          console.log(error)
        })
      break
    // 刪除歷史紀錄
    case 'D':
      const deleteMsg = await deleteMessage()

      event.reply({ type: 'text', text: deleteMsg })
        .then(data => {
          // 當訊息成功回傳後的處理
        })
        .catch(error => {
          // 當訊息回傳失敗後的處理
          console.log(error)
        })
      break
    //  google search
    case 'S':
      //  扣除陣列中字首
      textArr.splice(0, 1)

      // 展開陣列並去除空白
      newText = textArr.join('').trim()
      
      // 呼叫Google search api
      const locations = await locationSearch(newText)
      const locationsObject = locations.map(location => ({
        type: 'location',
        title: location.title,
        address: location.address,
        latitude: location.gps_coordinates.latitude,
        longitude: location.gps_coordinates.longitude
      }))

      // send message
      event.reply(locationsObject)
    default:
      return
    //  google image
    case 'M':
      //  扣除陣列中字首
      textArr.splice(0, 1)

      // 展開陣列並去除空白
      newText = textArr.join('').trim()

      const images = await imageSearch(newText)
      const imageObject = images.map(image => ({
        thumbnailImageUrl: image.original,
            title: image.source.slice(0, 29),
            text: image.title.slice(0, 50) + '...',
            actions: [{
              type: 'uri',
              label: 'View detail',
              uri: image.link
            }]
      }))

      // send message
      event.reply({
        type: 'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: imageObject
        }
      })   
  }
})

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', port, function () {
    console.log('Bot is already!')
})
