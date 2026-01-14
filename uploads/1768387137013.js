/*
fitur: sticker-quotely
credit: ©AlfiXD
channel: https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110
*/

import { Sticker } from 'wa-sticker-formatter'
import { createCanvas, loadImage } from 'canvas'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let txt = text ? text : typeof q.text == 'string' ? q.text : ''
        if (!txt) return m.reply(`Teksnya mana bre?`)

        let avatar = await conn.profilePictureUrl(q.sender, 'image').catch(_ => 'https://files.catbox.moe/rnc4sa.jpg')
        
       let req = await fakechatCanvas(txt, q.name || conn.getName(q.sender), avatar)

        let stiker = await new Sticker(req, {
            type: 'full',
            pack: global.packname || 'Bot Sticker',
            author: global.author || 'Gemini',
            quality: 100
        }).toBuffer()

        conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)

    } catch (e) {
        console.error(e)
        m.reply('Error pas bikin stiker!')
    }
}

handler.help = ['qc']
handler.tags = ['sticker']
handler.command = /^(qc|quotely)$/i

export default handler

async function fakechatCanvas(text, name, avatarUrl) {
     const fontSizeName = 28 
    const fontSizeText = 26 
    const avatarSize = 85  
    const padding = 20     
    const margin = 10. 
    
    const tempCanvas = createCanvas(1000, 1000)
    const tctx = tempCanvas.getContext('2d')
    
    tctx.font = `${fontSizeText}px sans-serif`
    const maxWidth = 480 
    const words = text.split(' ')
    let lines = []
    let currentLine = ''

    for (let n = 0; n < words.length; n++) {
        let testLine = currentLine + words[n] + ' '
        if (tctx.measureText(testLine).width > maxWidth && n > 0) {
            lines.push(currentLine)
            currentLine = words[n] + ' '
        } else {
            currentLine = testLine
        }
    }
    lines.push(currentLine)

    tctx.font = `bold ${fontSizeName}px sans-serif`
    const nameWidth = tctx.measureText(name).width
    tctx.font = `${fontSizeText}px sans-serif`
    const longestLine = lines.reduce((a, b) => tctx.measureText(a).width > tctx.measureText(b).width ? a : b)
    const textWidth = tctx.measureText(longestLine).width
    
    const bubbleWidth = Math.max(nameWidth, textWidth) + (padding * 2)
    const bubbleHeight = (lines.length * (fontSizeText + 12)) + 75

    const canvasWidth = margin + avatarSize + 12 + bubbleWidth + margin
    const canvasHeight = Math.max(avatarSize, bubbleHeight) + (margin * 2)

    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')

    let avatarImg;
    try {
        avatarImg = await loadImage(avatarUrl)
    } catch {
        avatarImg = await loadImage('https://files.catbox.moe/rnc4sa.jpg')
    }

    ctx.save()
    ctx.beginPath()
    ctx.arc(margin + avatarSize / 2, margin + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(avatarImg, margin, margin, avatarSize, avatarSize)
    ctx.restore()

    const bubbleX = margin + avatarSize + 8
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(bubbleX, margin, bubbleWidth, bubbleHeight, [0, 25, 25, 25])
    ctx.fill()
    ctx.fillStyle = '#f1a041'
    ctx.font = `bold ${fontSizeName}px sans-serif`
    ctx.fillText(name, bubbleX + padding, margin + 45)
    ctx.fillStyle = '#000000'
    ctx.font = `${fontSizeText}px sans-serif`
    let textY = margin + 90
    lines.forEach(line => {
        ctx.fillText(line.trim(), bubbleX + padding, textY)
        textY += fontSizeText + 12
    })

    return canvas.toBuffer('image/png')
}