const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 4000;
const fs = require('fs');
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './index.html'));
})

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) {
        res.statusCode(400).send("Require ");
    }
    const video = "./videostream.mp4";
    const sizes = fs.statSync(video).size;
    const CHUNK = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK, sizes - 1);
    const contentlength = end - start + 1;
    const headers = {
        "Accept-Ranges": 'bytes',
        "Content-Range": `bytes${start}-${end}/${sizes}`,
        "Content-Length": contentlength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers);
    const videostream = fs.createReadStream(video, { start, end });
    videostream.pipe(res);

})


app.all('*', (req, res) => {
    res.send('Result not found');
})
app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})