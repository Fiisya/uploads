// • Feature : lirik lagu
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110
// • sekref : https://whatsapp.com/channel/0029VbANq6v0VycMue9vPs3u/551

import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <judul lagu>`;
  
  m.reply('🔍 Mencari lirik...');
  
    const { data } = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(text)}`, {
      headers: {
        referer: `https://lrclib.net/search/${encodeURIComponent(text)}`,
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
      }
    });

    if (!data || data.length === 0) {
      return m.reply('❌ Lirik tidak ditemukan. Coba dengan kata kunci lain.');
    }

    const songsWithLyrics = data.filter(song => 
      (song.plainLyrics && song.plainLyrics.trim().length > 0) || 
      (song.syncedLyrics && song.syncedLyrics.trim().length > 0)
    );

    if (songsWithLyrics.length === 0) {
      return m.reply('❌ Lirik tidak ditemukan untuk lagu tersebut.');
    }

    const song = songsWithLyrics[0];
    const lyrics = song.plainLyrics || song.syncedLyrics;
    
    const songInfo = [
      `🎵 *${song.trackName || song.name}*`,
      `🎤 Artis: ${song.artistName}`,
      song.albumName && song.albumName !== 'null' ? `💿 Album: ${song.albumName}` : '',
      song.duration ? `⏱️ Durasi: ${formatDuration(song.duration)}` : '',
      '',
      '━━━━━━━━━━━━━━━',
      ''
    ].filter(Boolean).join('\n');

    const maxLength = 4000;
    let formattedLyrics = lyrics;
    
    if (lyrics.length > maxLength) {
      formattedLyrics = lyrics.substring(0, maxLength) + '\n\n... (lirik terlalu panjang, dipotong)';
    }

    const message = songInfo + formattedLyrics;
    
    return m.reply(message);
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

handler.help = ['lirik <judul>'];
handler.tags = ['internet'];
handler.command = /^(lirik|lyrics)$/i;
handler.limit = true;

export default handler;