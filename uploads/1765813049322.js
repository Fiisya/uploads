import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

async function uploadVidey(file) {
  try {
    const fileType = await fileTypeFromBuffer(file.data);
    if (!fileType || fileType.mime !== 'video/mp4') {
      throw new Error('Invalid file type. Only MP4 videos are allowed.');
    }
    const formData = new FormData();
    formData.append('file', Buffer.from(file.data), { filename: file.filename || 'video.mp4', contentType: 'video/mp4' });
    const response = await fetch('https://videy.co/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Upload failed with status ${response.status}: ${errorText}`
      );
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading to Videy:', error);
    throw error;
  }
}

const handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  if (!mime || mime !== 'video/mp4') {
    return m.reply(`Kirim/reply video dengan caption *${usedPrefix + command}*`);
  }
    
  try {    
    m.reply("wet...")
    
    const media = await q.download();
    if (!media) {
      throw new Error('Failed to download the media you sent. Please resend it.');
    }
    const fileObj = {
      data: media,
      filename: 'video.mp4',
      mimetype: mime,
    };
    
    const result = await uploadVidey(fileObj);
  
    await conn.sendMessage(m.chat, { text: `*Berhasil mengupload file ke videy:*\n\nhttps://videy.co/v?id=${result.id}\n\nHarap gunakan media dan fitur ini dengan bijak` }, { quoted: m });
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

handler.command = ['upvidey'];
handler.tags = ['internet'];
handler.help = ['upvidey <reply/kirim>'];
handler.limit = true;

export default handler;