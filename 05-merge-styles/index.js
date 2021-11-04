const { create } = require('domain');
const fs = require('fs');
const path = require('path');

let cssStream;

async function createBundle () {
    await fs.access(path.join(__dirname, 'project-dist', 'bundle.css'), (error) => {
        if (error) {
            console.log("Файл не найден, создаем");
            cssStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
        } else {
            console.log("Файл найден: удаляем и создаем заново");
            fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), (err) => {
                if (err) {
                    console.log(err);
                } else {
            cssStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));  
                }
            });
        }
    });
};
createBundle();

fs.readdir(path.join(__dirname, 'styles'), (err, content) => {
    if(err) {
        console.error;
    } else {
        for(let i = 0; i < content.length; i++) {
            let info = path.parse(content[i]);
            fs.stat(path.join(__dirname, 'styles', content[i]), (err, stats) => {
                if (stats.isFile() && info.ext.slice(1) == 'css') {
                    let rStream = fs.createReadStream(path.join(__dirname, 'styles', content[i]), 'utf-8');
                    rStream.on('readable', () => {
                        let data = rStream.read();
                        if (data !== null) {
                            let txt = data.toString();
                            cssStream.write(txt);
                        }
                    })
                    
                };
            });
        }
    }
})
