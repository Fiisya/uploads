// • Feature : tourl beton (image only) npm @zanixongroup/uploader
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import fetch from 'node-fetch';
import { Pomf, Quax, Videy, Ryzumi, Litterbox, Catbox, Uguu, Cloudku } from "@zanixongroup/uploader";
import bh from 'baileys_helper';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';
  
  if (/^image/.test(mime) && !/webp/.test(mime)) {
    m.reply('wett...');
    const img = await q.download();
    
    try {
      const [catboxUrl, pomfUrl, quaxUrl, ryzumiUrl, cloudkuUrl, uguuUrl] = await Promise.allSettled([
        Catbox(img).catch(() => null),
        Pomf(img).catch(() => null),
        Quax(img).catch(() => null),
        Ryzumi(img).catch(() => null),
        Cloudku(img).catch(() => null),
        Uguu(img).catch(() => null)
      ]);
      
      const results = {
        catbox: catboxUrl.status === 'fulfilled' ? catboxUrl.value : null,
        pomf: pomfUrl.status === 'fulfilled' ? pomfUrl.value : null,
        quax: quaxUrl.status === 'fulfilled' ? quaxUrl.value : null,
        ryzumi: ryzumiUrl.status === 'fulfilled' ? ryzumiUrl.value : null,
        cloudku: cloudkuUrl.status === 'fulfilled' ? cloudkuUrl.value : null,
        uguu: uguuUrl.status === 'fulfilled' ? uguuUrl.value : null
      };
      
      const successCount = Object.values(results).filter(url => url).length;
      
      if (successCount === 0) {
        throw new Error('Semua service gagal upload!');
      }
      
      let resultText = `✅ *Upload Berhasil!*\n📊 Berhasil: ${successCount}/6 service\n`;
      resultText += `🔗 *Link Results:*\n\n`;
      
      if (results.catbox) resultText += `📦 *Catbox* (No expiry)\n${results.catbox}\n`;
      if (results.pomf) resultText += `📦 *Pomf* (No expiry)\n${results.pomf}\n`;
      if (results.quax) resultText += `📦 *Quax* (No expiry)\n${results.quax}\n`;
      if (results.ryzumi) resultText += `📦 *Ryzumi* (24h expiry)\n${results.ryzumi}\n`;
      if (results.cloudku) resultText += `📦 *Cloudku* (No expiry)\n${results.cloudku}\n`;
      if (results.uguu) resultText += `📦 *Uguu* (3h expiry)\n${results.uguu}\n`;
      
      const buttons = [];
      
      if (results.catbox) {
        buttons.push({
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '📋 Copy Catbox',
            copy_code: results.catbox
          })
        });
      }
      
      if (results.pomf) {
        buttons.push({
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '📋 Copy Pomf',
            copy_code: results.pomf
          })
        });
      }
      
      if (results.quax) {
        buttons.push({
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '📋 Copy Quax',
            copy_code: results.quax
          })
        });
      }
      
      if (results.ryzumi) {
        buttons.push({
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '📋 Copy Ryzumi',
            copy_code: results.ryzumi
          })
        });
      }
      
      if (results.cloudku) {
        buttons.push({
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '📋 Copy Cloudku',
            copy_code: results.cloudku
          })
        });
      }
      
      if (results.uguu) {
        buttons.push({
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '📋 Copy Uguu',
            copy_code: results.uguu
          })
        });
      }
      
      await bh.sendInteractiveMessage(conn, m.chat, {
        text: resultText,
        title: '🖼️ Multi-Upload Complete',
        subtitle: `${successCount} services berhasil`,
        footer: 'Klik button untuk copy URL yang diinginkan',
        interactiveButtons: buttons
      });
      
    } catch (e) {
      console.error('Error:', e);
      m.reply('🚨 Error: ' + (e.message || e));
    }
  } else {
    m.reply(`📷 Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
  }
}

handler.help = ['tourl', 'upload'];
handler.tags = ['tools'];
handler.command = ['tourl', 'upload'];
handler.limit = true;

export default handler;