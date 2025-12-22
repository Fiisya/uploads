/* feature: upload videy
sumber: https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110
*/

import { Videy } from "@zanixongroup/uploader";
import bh from 'baileys_helper';
import path from 'path';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';
  
  if (/^video/.test(mime) || /video\/(mp4|avi|mkv|mov|webm|flv)/.test(mime)) {
    m.reply('⏳ Sedang upload video ke Videy, mohon tunggu...');
    
    try {
      const video = await q.download();

      let ext = path.extname(q.filename || '').slice(1);
      
      if (!ext && mime) {
        const mimeMap = {
          'video/mp4': 'mp4',
          'video/webm': 'webm',
          'video/avi': 'avi',
          'video/x-matroska': 'mkv',
          'video/quicktime': 'mov',
          'video/x-flv': 'flv'
        };
        ext = mimeMap[mime] || 'mp4';
      }
      
      const videyUrl = await Videy(video);
      
      if (!videyUrl) {
        throw new Error('Upload ke Videy gagal!');
      }
      
      await bh.sendInteractiveMessage(conn, m.chat, {
        text: `✅ *Video Upload Berhasil!*\n📹 Service: Videy\n📄 Format: ${ext.toUpperCase()}`,
        title: '🎬 Videy Upload Complete',
        subtitle: 'Video berhasil diupload',
        footer: 'Klik button untuk copy URL',
        interactiveButtons: [
          {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
              display_text: '📋 Copy URL',
              copy_code: videyUrl
            })
          },
          {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: '🔗 Buka Video',
              url: videyUrl
            })
          }
        ]
      });
      
    } catch (e) {
      console.error('Error:', e);
      m.reply('🚨 Error: ' + (e.message || e));
    }
  } else {
    m.reply(`🎬 Kirim video dengan caption *${usedPrefix + command}* atau tag video yang sudah dikirim.\n\n📝 Format support: MP4, WebM, AVI, MKV, MOV, FLV`);
  }
}

handler.help = ['tovidey - Upload video ke Videy'];
handler.tags = ['tools'];
handler.command = ['tovidey', 'upvidey'];
handler.limit = true;

export default handler;