// • Feature : generate image/text to image
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110
// • thanks to api https://api.nekolabs.my.id


import axios from 'axios';

let handler = async (m, { conn, text, command, args }) => {
  if (!text) {
    return m.reply(`❌ Masukkan prompt!\n\nContoh:\n• .${command} girl wearing glasses\n• .${command} girl wearing glasses --ratio 16:9\n\n📐 Ratio tersedia: 1:1, 16:9, 9:16`);
  }
  
  const apiMap = {
      'ai4chat': 'https://api.nekolabs.web.id/image-generation/ai4chat',
      'animaginexl31': 'https://api.nekolabs.web.id/image-generation/animagine/xl-3.1',
      'animaginexl40': 'https://api.nekolabs.web.id/image-generation/animagine/xl-4.0',
      'cartoony': 'https://api.nekolabs.web.id/image-generation/cartoony-anime',
      'dalle2': 'https://api.nekolabs.web.id/image-generation/dall-e/2',
      'dalle3': 'https://api.nekolabs.web.id/image-generation/dall-e/3',
      'dreamshaperxl': 'https://api.nekolabs.web.id/image-generation/dreamshaper-xl',
      'epicrealism': 'https://api.nekolabs.web.id/image-generation/epic-realism',
      'fluxdev': 'https://api.nekolabs.web.id/image-generation/flux/dev',
      'fluxschnell': 'https://api.nekolabs.web.id/image-generation/flux/schnell',
      'holymix': 'https://api.nekolabs.web.id/image-generation/holymix',
      'illumiyume': 'https://api.nekolabs.web.id/image-generation/illumiyume-xl',
      'illustriousme': 'https://api.nekolabs.web.id/image-generation/illustrious/me-v6',
      'illustriousxl': 'https://api.nekolabs.web.id/image-generation/illustrious/xl-1.0',
      'imagen3': 'https://api.nekolabs.web.id/image-generation/imagen/3.0-fast',
      'imagen4': 'https://api.nekolabs.web.id/image-generation/imagen/4.0-fast',
      'juggernautxl': 'https://api.nekolabs.web.id/image-generation/juggernaut-xl',
      'majicmix': 'https://api.nekolabs.web.id/image-generation/majicmix-realistic',
      'newreality': 'https://api.nekolabs.web.id/image-generation/newreality',
      'noobaixl': 'https://api.nekolabs.web.id/image-generation/noobai-xl',
      'noobai': 'https://api.nekolabs.web.id/image-generation/noobai',
      'pixarcartoon': 'https://api.nekolabs.web.id/image-generation/pixar-cartoon',
      'ponyrealism': 'https://api.nekolabs.web.id/image-generation/pony-realism',
      'seaartinfinity': 'https://api.nekolabs.web.id/image-generation/seaart/infinity',
      'seaartrealism': 'https://api.nekolabs.web.id/image-generation/seaart/realism',
      'stablediffusion': 'https://api.nekolabs.web.id/image-generation/stable-diffusion/3.5',
      'waianime': 'https://api.nekolabs.web.id/image-generation/wai-anime-nsfw',
      'writecream': 'https://api.nekolabs.web.id/image-generation/writecream',
      'yayoimix': 'https://api.nekolabs.web.id/image-generation/yayoimix',
      'yiffymix': 'https://api.nekolabs.web.id/image-generation/yiffymix'
    };
    
    const aiNameMap = {
      'ai4chat': 'AI4Chat',
      'animaginexl31': 'Animagine XL 3.1',
      'animaginexl40': 'Animagine XL 4.0',
      'cartoony': 'Cartoony Anime',
      'dalle2': 'DALL-E 2',
      'dalle3': 'DALL-E 3',
      'dreamshaperxl': 'Dreamshaper XL',
      'epicrealism': 'Epic Realism',
      'fluxdev': 'Flux Dev',
      'fluxschnell': 'Flux Schnell',
      'holymix': 'Holymix',
      'illumiyume': 'Illumiyume XL',
      'illustriousme': 'Illustrious ME v6',
      'illustriousxl': 'Illustrious XL 1.0',
      'imagen3': 'Imagen 3.0 Fast',
      'imagen4': 'Imagen 4.0 Fast',
      'juggernautxl': 'Juggernaut XL',
      'majicmix': 'Majicmix Realistic',
      'newreality': 'New Reality',
      'noobaixl': 'NoobAI XL',
      'noobai': 'NoobAI',
      'pixarcartoon': 'Pixar Cartoon',
      'ponyrealism': 'Pony Realism',
      'seaartinfinity': 'SeaArt Infinity',
      'seaartrealism': 'SeaArt Realism',
      'stablediffusion': 'Stable Diffusion 3.5',
      'waianime': 'WAI Anime',
      'writecream': 'Writecream',
      'yayoimix': 'Yayoimix',
      'yiffymix': 'Yiffymix'
    };
    
    if (!apiMap[command]) {
      return m.reply(`❌ Command tidak ditemukan!\n\nGunakan salah satu command yang tersedia.\nKetik *.menu ai* untuk melihat daftar command.`);
    }
    
    m.reply('wett...');
    
    const apiUrl = apiMap[command];
    const aiName = aiNameMap[command];
    
    let prompt = text;
    let ratio = '1:1';
    const ratioMatch = text.match(/--ratio\s+(1:1|16:9|9:16)/i);
    if (ratioMatch) {
      ratio = ratioMatch[1];
      prompt = text.replace(/--ratio\s+(1:1|16:9|9:16)/i, '').trim();
    }
    
    const response = await axios.get(apiUrl, {
      params: {
        prompt: prompt,
        ratio: ratio
      },
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const data = response.data;
    
    if (!data.success) {
      return m.reply(`❌ Gagal menghasilkan gambar.\n\nAPI Response: ${data.message || 'Unknown error'}\n\nSilakan coba lagi.`);
    }
    
    if (!data.result) {
      return m.reply('❌ Tidak ada gambar yang dihasilkan. Silakan coba prompt yang berbeda.');
    }
    
    const resultUrl = data.result;
    
    await conn.sendMessage(m.chat, { 
      image: { url: resultUrl },
      caption: `✅ *${aiName}*\n\n📝 Prompt: ${prompt}\n📐 Ratio: ${ratio}\n⏱️ Response Time: ${data.responseTime}\n🕐 Timestamp: ${data.timestamp}`
    }, { quoted: m });
}

handler.help = [
  'ai4chat <prompt>',
  'animaginexl31 <prompt>',
  'animaginexl40 <prompt>',
  'cartoony <prompt>',
  'dalle2 <prompt>',
  'dalle3 <prompt>',
  'dreamshaperxl <prompt>',
  'epicrealism <prompt>',
  'fluxdev <prompt>',
  'fluxschnell <prompt>',
  'holymix <prompt>',
  'illumiyume <prompt>',
  'illustriousme <prompt>',
  'illustriousxl <prompt>',
  'imagen3 <prompt>',
  'imagen4 <prompt>',
  'juggernautxl <prompt>',
  'majicmix <prompt>',
  'newreality <prompt>',
  'noobaixl <prompt>',
  'noobai <prompt>',
  'pixarcartoon <prompt>',
  'ponyrealism <prompt>',
  'seaartinfinity <prompt>',
  'seaartrealism <prompt>',
  'stablediffusion <prompt>',
  'waianime <prompt>',
  'writecream <prompt>',
  'yayoimix <prompt>',
  'yiffymix <prompt>'
];

handler.tags = ['ai'];

handler.command = [
  'ai4chat',
  'animaginexl31',
  'animaginexl40',
  'cartoony',
  'dalle2',
  'dalle3',
  'dreamshaperxl',
  'epicrealism',
  'fluxdev',
  'fluxschnell',
  'holymix',
  'illumiyume',
  'illustriousme',
  'illustriousxl',
  'imagen3',
  'imagen4',
  'juggernautxl',
  'majicmix',
  'newreality',
  'noobaixl',
  'noobai',
  'pixarcartoon',
  'ponyrealism',
  'seaartinfinity',
  'seaartrealism',
  'stablediffusion',
  'waianime',
  'writecream',
  'yayoimix',
  'yiffymix'
];

handler.limit = true;

export default handler;