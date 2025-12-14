// • Feature :  lirik generator 
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import fetch from 'node-fetch';

const generateLyrics = async (prompt) => {
  const url = 'https://lyricsgenerator.com/api/completion';
  const payload = { prompt };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'content-type': 'text/plain;charset=UTF-8',
      'origin': 'https://lyricsgenerator.com',
      'referer': 'https://lyricsgenerator.com',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
    },
    body: JSON.stringify(payload),
  });

  return response.text();
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <isi prompt>`;
  
  try {
    const lyrics = await generateLyrics(text);
    m.reply(lyrics);
  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['genlirik'];
handler.tags = ['ai'];
handler.command = ['genlirik', 'lirikgen'];
handler.limit = true;

export default handler;
