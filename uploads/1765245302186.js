// • Feature : convert image 
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110
// • thanks to api https://api.nekolabs.my.id

import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  
  if (!mime.startsWith('image/')) {
    return m.reply('❌ Kirim atau reply gambar terlebih dahulu!');
  }
  
  const apiMap = {
    'anime': 'https://api.nekolabs.web.id/style-changer/anime',
    'cartoon': 'https://api.nekolabs.web.id/style-changer/cartoon',
    'comic': 'https://api.nekolabs.web.id/style-changer/comic',
    'cyberpunk': 'https://api.nekolabs.web.id/style-changer/cyberpunk',
    'disney': 'https://api.nekolabs.web.id/style-changer/disney',
    'figure': 'https://api.nekolabs.web.id/style-changer/figure',
    'ghibli': 'https://api.nekolabs.web.id/style-changer/ghibli',
    'gta': 'https://api.nekolabs.web.id/style-changer/gta',
    'manga': 'https://api.nekolabs.web.id/style-changer/manga',
    'oilpainting': 'https://api.nekolabs.web.id/style-changer/oil-painting',
    'pixar': 'https://api.nekolabs.web.id/style-changer/pixar',
    'pixelated': 'https://api.nekolabs.web.id/style-changer/pixelated',
    'polaroid': 'https://api.nekolabs.web.id/style-changer/polaroid',
    'removeclothes': 'https://api.nekolabs.web.id/style-changer/remove-clothes',
    'sketch': 'https://api.nekolabs.web.id/style-changer/sketch',
    'vintage': 'https://api.nekolabs.web.id/style-changer/vintage',
    'watercolor': 'https://api.nekolabs.web.id/style-changer/watercolor'
  };
  
  const styleNameMap = {
    'anime': 'Anime Style',
    'cartoon': 'Cartoon Style',
    'comic': 'Comic Style',
    'cyberpunk': 'Cyberpunk Style',
    'disney': 'Disney Style',
    'figure': 'Figure Style',
    'ghibli': 'Studio Ghibli Style',
    'gta': 'GTA Style',
    'manga': 'Manga Style',
    'oilpainting': 'Oil Painting Style',
    'pixar': 'Pixar Style',
    'pixelated': 'Pixelated Style',
    'polaroid': 'Polaroid Style',
    'removeclothes': 'Remove Clothes',
    'sketch': 'Sketch Style',
    'vintage': 'Vintage Style',
    'watercolor': 'Watercolor Style'
  };
  
  if (!apiMap[command]) {
    return m.reply('❌ Command tidak ditemukan!\n\nKetik *menu* untuk melihat daftar style.');
  }
  
  m.reply('wett...');
  
  try {
    const media = await q.download();
    const imageUrl = await uploadImage(media);
    
    const apiUrl = apiMap[command];
    const styleName = styleNameMap[command];
    
    // Request menggunakan axios
    const response = await axios.get(apiUrl, {
      params: {
        imageUrl: imageUrl
      },
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const data = response.data;
    
    if (!data.success) {
      return m.reply(`❌ Gagal memproses gambar.\n\nAPI Response: ${data.message || 'Unknown error'}\n\nSilakan coba lagi.`);
    }
    
    if (!data.result) {
      return m.reply('❌ Tidak ada hasil yang dihasilkan. Silakan coba gambar lain.');
    }
    
    const resultUrl = data.result;
    
    await conn.sendMessage(m.chat, { 
      image: { url: resultUrl },
      caption: `✅ *${styleName}*\n\n⏱️ Response Time: ${data.responseTime}\n🕐 Timestamp: ${data.timestamp}`
    }, { quoted: m });
    
  } catch (e) {
    console.error('Error:', e);
    
    let errorMsg = 'Unknown error';
    
    if (e.response) {
      errorMsg = `API Error ${e.response.status}: ${e.response.statusText}`;
      if (e.response.data?.message) {
        errorMsg += `\n${e.response.data.message}`;
      }
    } else if (e.request) {
      errorMsg = 'Tidak ada respon dari server. Cek koneksi internet Anda.';
    } else {
      errorMsg = e.message || 'Unknown error';
    }
    
    m.reply(`❌ Terjadi kesalahan:\n${errorMsg}\n\n💡 Tips:\n- Pastikan gambar jelas dan berkualitas baik\n- Coba style lain jika masalah berlanjut\n- Hubungi admin jika error terus muncul`);
  }
}

handler.help = [
  'anime',
  'cartoon',
  'comic',
  'cyberpunk',
  'disney',
  'figure',
  'ghibli',
  'gta',
  'manga',
  'oilpainting',
  'pixar',
  'pixelated',
  'polaroid',
  'removeclothes',
  'sketch',
  'vintage',
  'watercolor'
];

handler.tags = ['ai'];

handler.command = [
  'anime',
  'cartoon',
  'comic',
  'cyberpunk',
  'disney',
  'figure',
  'ghibli',
  'gta',
  'manga',
  'oilpainting',
  'pixar',
  'pixelated',
  'polaroid',
  'removeclothes',
  'sketch',
  'vintage',
  'watercolor'
];

handler.limit = true;

export default handler;