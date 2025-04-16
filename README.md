## Run the bot
```javascript
async function alfixdRaw(fileBuffer) {
    try {
        const form = new FormData();
        form.append('file', fileBuffer, { filename: 'upload.jpg' }); // Tambahkan nama file

        const response = await fetch('https://upfilegh.alfiisyll.biz.id/upload', {
            method: 'POST',
            body: form,
            headers: form.getHeaders(),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const htmlResponse = await response.text();
        const $ = cheerio.load(htmlResponse);
        const rawUrl = $('#rawUrlLink').attr('href');

        return rawUrl ? [{ name: 'Alfixd', url: rawUrl }] : [];
    } catch (error) {
        console.error('Upload error:', error);
        return [];
    }
}
```
