// • Feature : an1 search download
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import axios from 'axios'
import { fileTypeFromBuffer } from 'file-type'

const API_BASE = 'https://api.nekolabs.web.id'

async function downloadAN1(url) {
  try {
    const { data } = await axios.get(`${API_BASE}/downloader/android1`, {
      params: { url: url },
      timeout: 60000
    })

    if (!data.success || !data.result) {
      throw new Error('Download gagal')
    }

    return {
      success: true,
      title: data.result.title,
      icon: data.result.icon,
      version: data.result.version,
      downloadUrl: data.result.downloadUrl,
      responseTime: data.responseTime
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Gagal mengunduh APK')
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

async function handler(m, { conn, args, usedPrefix, command }) {
  try {
    if (!args[0]) {
      return m.reply(`❌ *Masukkan URL AN1!*\n\n*Contoh:*\n${usedPrefix + command} https://an1.com/1584-hill-climb-racing-mod-apk-android1.html\n\n💡 *Cara mencari APK:*\nKetik: ${usedPrefix}an1 <nama aplikasi>`)
    }

    const url = args[0]

    if (!url.includes('an1.com')) {
      return m.reply('❌ URL harus dari an1.com!')
    }

    await m.reply('📥 *Mengunduh APK...*\n_Proses ini memakan waktu, mohon tunggu_')

    const result = await downloadAN1(url)

    let infoMessage = `✅ *APK READY TO DOWNLOAD*\n\n`
    infoMessage += `📱 *Nama:* ${result.title}\n`
    infoMessage += `📦 *Versi:* ${result.version}\n`
    infoMessage += `⚡ *Response Time:* ${result.responseTime}\n\n`
    infoMessage += `⏳ *Sedang mengirim file APK...*\n`
    infoMessage += `_Download mungkin memakan waktu beberapa menit_`

    await conn.sendMessage(m.chat, {
      image: { url: result.icon },
      caption: infoMessage
    }, { quoted: m })

    let downloadedSize = 0
    let totalSize = 0
    let lastProgress = 0

    const apkResponse = await axios.get(result.downloadUrl, {
      responseType: 'arraybuffer',
      timeout: 180000,
      maxContentLength: 200 * 1024 * 1024,
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          downloadedSize = progressEvent.loaded
          totalSize = progressEvent.total
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          
          if (percentCompleted >= lastProgress + 25) {
            lastProgress = percentCompleted
            console.log(`📥 Download progress: ${percentCompleted}% (${formatBytes(downloadedSize)}/${formatBytes(totalSize)})`)
          }
        }
      }
    })

    const fileType = await fileTypeFromBuffer(apkResponse.data)
    console.log('File type detected:', fileType)

    const cleanTitle = result.title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50)

    const fileName = `${cleanTitle}_v${result.version}.apk`
    const fileSize = formatBytes(apkResponse.data.byteLength)

    console.log(`✅ APK downloaded successfully: ${fileName} (${fileSize})`)

    await conn.sendMessage(m.chat, {
      document: apkResponse.data,
      fileName: fileName,
      mimetype: 'application/vnd.android.package-archive',
      caption: `✅ *Download Complete!*\n\n📱 *Nama:* ${result.title}\n📦 *Version:* ${result.version}\n📁 *File:* ${fileName}\n💾 *Size:* ${fileSize}`
    }, { quoted: m })

    console.log(`✅ APK sent successfully to chat`)

  } catch (error) {
    console.error('Error in AN1 download:', error)
    await m.reply(`${error.message}`)
  }
}

handler.help = ['an1dl'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(an1dl|an1download|apkdl)$/i

handler.limit = true
handler.register = true

export default handler