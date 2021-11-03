const path = require('path');
const fs = require('fs');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

stream.on('readable', () => {
    let data = stream.read();
    if (data !== null) {
        console.log(data);
    }
})