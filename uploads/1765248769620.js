// • Feature : remove watermark
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110
// • sengkrep : https://whatsapp.com/channel/0029Vap84RE8KMqfYnd0V41A/3284



import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

async function ezremove(path) {
  const form = new FormData();
  form.append('image_file', fs.createReadStream(path), path.split('/').pop());

  const create = await axios.post(
    'https://api.ezremove.ai/api/ez-remove/watermark-remove/create-job',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0',
        origin: 'https://ezremove.ai',
        'product-serial': 'sr-' + Date.now()
      }
    }
  ).then(v => v.data).catch(() => null);

  if (!create || !create.result || !create.result.job_id) {
    return { status: 'error' };
  }

  const job = create.result.job_id;

  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 2000));

    const check = await axios.get(
      `https://api.ezremove.ai/api/ez-remove/watermark-remove/get-job/${job}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          origin: 'https://ezremove.ai',
          'product-serial': 'sr-' + Date.now()
        }
      }
    ).then(v => v.data).catch(() => null);

    if (check && check.code === 100000 && check.result && check.result.output) {
      return { job, result: check.result.output[0] };
    }

    if (!check || !check.code || check.code !== 300001) break;
  }

  return { status: 'processing', job };
}

let handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';

  if (/^image/.test(mime) && !/webp/.test(mime)) {
    m.reply('⏳ Sedang memproses gambar, mohon tunggu...');
    const img = await q.download();
    const tempPath = './tmp/image.jpg';
    fs.writeFileSync(tempPath, img);

    const result = await ezremove(tempPath);
    fs.unlinkSync(tempPath);

    if (result.status === 'error') {
      m.reply('🚨 Gagal menghapus watermark dari gambar.');
      return;
    }

    await conn.sendMessage(m.chat, {
      image: { url: result.result },
      caption: '✅ Watermark berhasil dihapus.'
    }, { quoted: m });
  } else {
    m.reply('📷 Kirim gambar dengan caption *}.ezremove* atau tag gambar yang sudah dikirim.');
  }
}

handler.help = ['removewm'];
handler.tags = ['tools'];
handler.command = ['ezremove', 'remwm', 'removewm'];
handler.limit = true;

export default handler;
