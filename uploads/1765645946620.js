// • Feature : an1 search download
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import axios from 'axios'

const API_BASE = 'https://api.nekolabs.web.id'

async function searchAN1(query) {
  try {
    const { data } = await axios.get(`${API_BASE}/discovery/android1/search`, {
      params: { q: query },
      timeout: 30000
    })

    if (!data.success || !data.result) {
      throw new Error('Pencarian gagal')
    }

    return {
      success: true,
      results: data.result,
      responseTime: data.responseTime
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Gagal melakukan pencarian')
  }
}


async function handler(m, { conn, text, usedPrefix, command }) {
  try {
    if (!text) {
      return m.reply(`❌ *Masukkan nama aplikasi!*\n\n*Contoh:*\n${usedPrefix + command} hill climb racing\n${usedPrefix + command} mobile legends\n${usedPrefix + command} gta san andreas`)
    }

    await m.reply('🔍 *Mencari APK...*\n_Mohon tunggu sebentar_')

    const result = await searchAN1(text)

    if (!result.results || result.results.length === 0) {
      return m.reply(`❌ *Tidak ditemukan!*\n\nTidak ada hasil untuk: *${text}*`)
    }

    let message = `✅ *AN1 APK SEARCH*\n\n`
    message += `📱 *Query:* ${text}\n`
    message += `📊 *Total:* ${result.results.length} aplikasi\n`
    message += `⚡ *Response Time:* ${result.responseTime}\n\n`
    message += `━━━━━━━━━━━━━━━\n\n`

    result.results.forEach((app, index) => {
      message += `*${index + 1}. ${app.name}*\n`
      message += `👨‍💻 Developer: ${app.developer}\n`
      message += `⭐ Rating: ${app.rating}/5\n`
      message += `🔗 URL: ${app.url}\n\n`
    })

    message += `━━━━━━━━━━━━━━━\n\n`
    message += `💡 *Cara Download:*\n`
    message += `Ketik: ${usedPrefix}an1dl <url>\n\n`
    message += `*Contoh:*\n`
    message += `${usedPrefix}an1dl ${result.results[0].url}`

    await m.reply(message)

  } catch (error) {
    console.error('Error in AN1 search:', error)
    await m.reply(`❌ *Terjadi kesalahan!*\n\n${error.message}`)
  }
}

handler.help = ['an1'].map(v => v + ' <query>')
handler.tags = ['internet']
handler.command = /^(an1|an1search|apk)$/i

handler.limit = true
handler.register = true

export default handler