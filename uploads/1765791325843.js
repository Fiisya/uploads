// • Feature : cek imei
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <imei>`;

  const imei = text.trim();
  try {
    const response = await fetch(`https://api.nekolabs.web.id/tools/imei-info?imei=${imei}`);
    const data = await response.json();

    if (!data.success) throw new Error('Gagal mendapatkan informasi IMEI.');

    const deviceInfo = data.result;
    const { brand, model, photo } = deviceInfo.result.header;
    const items = deviceInfo.result.items;

    let message = `🔍 *Informasi IMEI*\n\n`;
    message += `📱 *Brand:* ${brand}\n`;
    message += `📱 *Model:* ${model}\n`;
    message += `🔢 *IMEI:* ${deviceInfo.imei}\n`;

    items.forEach(item => {
      if (item.role === 'header') {
        message += `\n*${item.title}*\n`;
        message += `━━━━━━━━━━━━━━━━\n`;
      } else if (item.role === 'item') {
        message += `• ${item.title}: ${item.content}\n`;
      } else if (item.role === 'button' && item.title === 'Full device specification') {
        message += `\n🔗 *Spesifikasi Lengkap:*\n${item.content}\n`;
      } else if (item.role === 'button' && item.title === 'Support Team Contact') {
        message += `\n📧 *Kontak Support:*\n${item.content}\n`;
      } else if (item.role === 'group') {
        message += `\n*Link Berguna:*\n`;
        item.items.forEach(subItem => {
          if (subItem.role === 'button') {
            message += `• ${subItem.title}: ${subItem.content}\n`;
          }
        });
      }
    });

    await conn.sendMessage(m.chat, {
      image: { url: photo },
      caption: message
    }, { quoted: m });
  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['cekimei'];
handler.tags = ['tools'];
handler.command = ['cekimei'];
handler.limit = true;

export default handler;