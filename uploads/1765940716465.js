// • Feature : emoji gif
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import axios from 'axios';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

const stickpack = 'EmojiGIF Sticker';
const stickauth = 'Created by Inori Weabot\n\n© Svazer';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Masukkan emoji untuk membuat stiker GIF!\nContoh: ${usedPrefix}${command} 😝`;
    }

    const emojiRegex = /\p{Emoji}/u;
    if (!emojiRegex.test(text.trim())) {
        throw 'Harap masukkan emoji yang valid!';
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const url = `https://anabot.my.id/api/maker/emojiGif?emote=${encodeURIComponent(text.trim())}&apikey=freeApikey`;

        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 10000,
            headers: {
                'Accept': 'image/gif,image/webp,video/mp4'
            }
        });

        if (response.data.length > 1000000) {
            throw 'File terlalu besar! Maksimal 1MB untuk stiker.';
        }

        const contentType = response.headers['content-type'];
        if (!['image/gif', 'image/webp', 'video/mp4'].includes(contentType)) {
            throw 'Format file tidak didukung! Harus GIF, WebP, atau MP4.';
        }

        const sticker = new Sticker(Buffer.from(response.data), {
            pack: stickpack,
            author: stickauth,
            type: StickerTypes.ANIMATED,
            quality: 50,
            fps: contentType === 'video/mp4' ? 10 : undefined
        });

        const stickerBuffer = await sticker.toBuffer();
        
        await conn.sendMessage(m.chat, { 
            sticker: stickerBuffer 
        }, { 
            quoted: m 
        });

        await conn.sendMessage(m.chat, { 
            react: { text: '✅', key: m.key } 
        });

    } catch (error) {
        console.error('Error creating sticker:', error.message);
        
        const errorMessage = error.response 
            ? 'Gagal mengambil data dari API. Coba lagi nanti.'
            : error.message.includes('timeout')
            ? 'Koneksi ke API timeout. Silakan coba lagi.'
            : `Terjadi kesalahan: ${error.message}`;

        await conn.sendMessage(m.chat, { 
            text: errorMessage,
            react: { text: '❌', key: m.key }
        }, { quoted: m });
    }
};

handler.help = ['emojigif <emoji>'];
handler.tags = ['sticker'];
handler.command = /^(emojigif|gifemoji)$/i;
handler.limit = 2;
handler.premium = false;

export default handler;