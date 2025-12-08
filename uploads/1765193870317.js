// • Feature : Claude AI
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import axios from 'axios';
import FormData from 'form-data';

function getDataAttr(html, attr) {
  const re = new RegExp(`data-${attr}\\s*=\\s*["']([^"']+)["']`, 'i');
  const m = html.match(re);
  return m ? m[1] : '';
}

const handler = async (m, { text, command }) => {
  if (!text) {
    return m.reply(
      `Format salah!\n\nContoh penggunaan:\n*.${command} Siapa penemu gravitasi?*`
    );
  }

  const baseHeaders = {
    Accept: '*/*',
    Referer: 'https://claudeai.one/',
    Origin: 'https://claudeai.one',
  };

  try {
    const { data: html } = await axios.get('https://claudeai.one/', {
      headers: baseHeaders,
    });
    const nonce   = getDataAttr(html, 'nonce');
    const postId  = getDataAttr(html, 'post-id');
    const botId   = getDataAttr(html, 'bot-id');
    const clientIdMatch = html.match(
      /localStorage\.setItem\(['"]wpaicg_chat_client_id['"],\s*['"]([^'"]+)['"]\)/
    );
    const clientId =
      clientIdMatch?.[1] ??
      'JHFiony-' + Math.random().toString(36).substring(2, 12);

    const form = new FormData();
    form.append('_wpnonce', nonce);
    form.append('post_id', postId);
    form.append('url', 'https://claudeai.one');
    form.append('action', 'wpaicg_chat_shortcode_message');
    form.append('message', text);
    form.append('bot_id', botId);
    form.append('chatbot_identity', 'shortcode');
    form.append('wpaicg_chat_history', '[]');
    form.append('wpaicg_chat_client_id', clientId);
    const { data: resp } = await axios.post(
      'https://claudeai.one/wp-admin/admin-ajax.php',
      form,
      {
        headers: {
          ...baseHeaders,
          ...form.getHeaders(),
        },
      }
    );
    const answer = resp?.data;
    if (!answer) {
      return m.reply('malas menanggapi🧢🧢');
    }

    await m.reply(answer);
  } catch (err) {
    const info = err.response?.data || err.message;
    await m.reply('Terjadi error:\n' + JSON.stringify(info, null, 2));
  }
};

handler.help = ['claude <teks>'];
handler.tags = ['ai'];
handler.command = /^claude$/i;
handler.limit = true;

export default handler;
