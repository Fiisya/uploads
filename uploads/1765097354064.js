// • Feature : ytsearch beton
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import yts from 'yt-search'
import bh from 'baileys_helper'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} lady gaga`
  await m.reply(global.wait)
  
  const results = await yts(text).catch(() => null)
  if (!results?.all?.length) throw 'Tidak ditemukan hasil pencarian.'
  
  const videos = results.all.filter(v => v.type === 'video')
  if (!videos.length) throw 'Tidak ada video yang ditemukan.'
  
  const args = text.split(' ')
  const lastArg = args[args.length - 1]
  let index = 0
  let searchQuery = text
  
  if (!isNaN(lastArg)) {
    index = parseInt(lastArg, 10) - 1
    searchQuery = args.slice(0, -1).join(' ')
  }
  
  index = Math.max(0, Math.min(index, videos.length - 1))
  const video = videos[index]
  
  const caption =
    `~> *${video.title}*\n` +
    `~> *Link:* ${video.url}\n` +
    `~> *Duration:* ${video.timestamp}\n` +
    `~> *Uploaded:* ${video.ago}\n` +
    `~> *Views:* ${video.views}`
  
  const interactiveButtons = [
    {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({ 
        display_text: '📹 Video', 
        id: `.ytmp4 ${video.url}` 
      })
    },
    {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({ 
        display_text: '🎧 Audio', 
        id: `.ytmp3 ${video.url}` 
      })
    }
  ]
  
  if (index > 0) {
    interactiveButtons.unshift({
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({ 
        display_text: '⬅️ Sebelumnya', 
        id: `.yts ${searchQuery} ${index}` 
      })
    })
  }
  
  if (index < videos.length - 1) {
    interactiveButtons.push({
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({ 
        display_text: 'Berikutnya ➡️', 
        id: `.yts ${searchQuery} ${index + 2}` 
      })
    })
  }
  
  console.log('Available functions in baileys_helper:', Object.keys(bh))
  
  const sendFunc = bh.sendInteractiveMessage || bh.sendInteractive || bh.sendButtonMessage || bh.sendButtons
  
  if (sendFunc) {
    await sendFunc(conn, m.chat, {
      text: caption,
      footer: 'Yuzuriha - Weabot',
      interactiveButtons
    })
  } else {
    let msg = caption + '\n\n'
    interactiveButtons.forEach((btn, i) => {
      const params = JSON.parse(btn.buttonParamsJson)
      msg += `${i + 1}. ${params.display_text}\n`
    })
    await m.reply(msg)
  }
}

handler.help = ['yts <query>', 'yts <query> <nomor>']
handler.tags = ['internet']
handler.command = /^yts(earch)?$/i

export default handler