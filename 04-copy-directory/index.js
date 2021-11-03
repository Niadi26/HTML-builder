const fs = require('fs');
const { copyFile } = require('fs/promises');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) {console.log('Cant create directory')}
});

async function clearDir () {
    await fs.readdir(path.join(__dirname, 'files-copy'), (err, copyItems) => {
            if (err) {console.error};
            for(x = 0; x < copyItems.length; x++) {
                fs.unlink(path.join(__dirname, 'files-copy', copyItems[x]),()=>{});
            }
    });
}
clearDir();

fs.readdir(path.join(__dirname, 'files'), (err, items) => {
    if (err) {
        console.log('This papka is not found');
    }
    else {
        for(i = 0; i < items.length; i++) {
            fs.copyFile(path.join(__dirname, 'files', items[i]), path.join(__dirname, 'files-copy', items[i]), (err)=>{
                if (err) {console.error}
            });
        }
    }
}); 
