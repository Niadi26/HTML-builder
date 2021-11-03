const path = require('path');
const fs = require('fs');
const process = require('process');

let writeStream = fs.createWriteStream(path.join(__dirname, 'your text.txt'));

console.log('Give me a text or exit right now!');

process.stdin.on('data', (data) =>{
    let txt = data.toString();
    if (txt.trim() == 'exit') {
        console.log('Goodbye!');
        process.exit();
    } 
    else {
        writeStream.write(txt);
        console.log("Give me more text or write 'exit'!");
    }
})

process.on("SIGINT", function () {
    console.log('Goodbye!');
    process.exit();
  });