// • Feature : edit image 
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110
// • thanks to api https://api.nekolabs.my.id

import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  
  if (!mime.startsWith('image/')) {
    return m.reply('❌ Kirim atau reply gambar terlebih dahulu!');
  }
  
  if (!text) {
    return m.reply('❌ Masukkan prompt!\n\nContoh: .' + command + ' to anime style art');
  }
  
  m.reply('⏳ Sedang memproses...');
  
  try {
    const media = await q.download();
    const imageUrl = await uploadImage(media);
    
    const apiMap = {
      'fluxkontext': 'https://api.nekolabs.web.id/image-generation/flux/kontext/v1',
      'fluxkontext2': 'https://api.nekolabs.web.id/image-generation/flux/kontext/v2',
      'gptimage': 'https://api.nekolabs.web.id/image-generation/gpt-image/v1',
      'gptimage2': 'https://api.nekolabs.web.id/image-generation/gpt-image/v2',
      'nanobanana': 'https://api.nekolabs.web.id/image-generation/nano-banana/v1',
      'nanobanana2': 'https://api.nekolabs.web.id/image-generation/nano-banana/v2',
      'nanobanana3': 'https://api.nekolabs.web.id/image-generation/nano-banana/v3',
      'nanobanana4': 'https://api.nekolabs.web.id/image-generation/nano-banana/v4',
      'nanobanana5': 'https://api.nekolabs.web.id/image-generation/nano-banana/v5',
      'nanobanana6': 'https://api.nekolabs.web.id/image-generation/nano-banana/v6',
      'seedream': 'https://api.nekolabs.web.id/image-generation/seedream/v1'
    };
    
    const aiNameMap = {
      'fluxkontext': 'Flux Kontext AI v1',
      'fluxkontext2': 'Flux Kontext AI v2',
      'gptimage': 'GPT Image AI v1',
      'gptimage2': 'GPT Image AI v2',
      'nanobanana': 'Nano Banana AI v1',
      'nanobanana2': 'Nano Banana AI v2',
      'nanobanana3': 'Nano Banana AI v3',
      'nanobanana4': 'Nano Banana AI v4',
      'nanobanana5': 'Nano Banana AI v5',
      'nanobanana6': 'Nano Banana AI v6',
      'seedream': 'Seedream AI'
    };
    
    const apiUrl = apiMap[command];
    const aiName = aiNameMap[command];
    
    const response = await fetch(`${apiUrl}?prompt=${encodeURIComponent(text)}&imageUrl=${encodeURIComponent(imageUrl)}`);
    const data = await response.json();
    
    if (!data.success) {
      return m.reply('❌ Gagal memproses gambar. Silakan coba lagi.');
    }
    
    const resultUrl = data.result;
    
    await conn.sendMessage(m.chat, { 
      image: { url: resultUrl },
      caption: `✅ *${aiName}*\n\n📝 Prompt: ${text}\n⏱️ Response Time: ${data.responseTime}\n🕐 Timestamp: ${data.timestamp}`
    }, { quoted: m });
    
  } catch (e) {
    console.error('Error:', e);
    m.reply(`❌ Terjadi kesalahan:\n${e.message}`);
  }
}

handler.help = [
  'fluxkontext <prompt>', 
  'fluxkontext2 <prompt>', 
  'gptimage <prompt>', 
  'gptimage2 <prompt>', 
  'nanobanana <prompt>', 
  'nanobanana2 <prompt>', 
  'nanobanana3 <prompt>', 
  'nanobanana4 <prompt>', 
  'nanobanana5 <prompt>', 
  'nanobanana6 <prompt>', 
  'seedream <prompt>'
];
handler.tags = ['ai'];
handler.command = [
  'fluxkontext', 
  'fluxkontext2', 
  'gptimage', 
  'gptimage2', 
  'nanobanana', 
  'nanobanana2', 
  'nanobanana3', 
  'nanobanana4', 
  'nanobanana5', 
  'nanobanana6', 
  'seedream'
];
handler.limit = true;

export default handler;