const path = require('path');
const fs = require('fs');

 fs.readdir(path.join(__dirname, 'secret-folder'), (err, content) => {
    if(err) {
        console.log('This papka is not found');
    }
    else {
        for (i =0; i < content.length; i++) {
            let info = path.parse(content[i]);
            fs.stat(path.join(__dirname, 'secret-folder', content[i]), (err, stats) =>{
                if(stats.isFile()) {
                console.log(`${info.name} - ${info.ext.slice(1)} - ${stats.size}b`);
                }
            })
        }
    }
})

