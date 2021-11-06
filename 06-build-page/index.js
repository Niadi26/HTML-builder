const { constants } = require('buffer');
const { captureRejections } = require('events');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { addListener } = require('process');

let dirAdress = path.join(__dirname, 'project-dist');
let assetsAdress = 'assets';

function createDir () {
    fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
        if(err) {console.log('Error in createDir')}; 
     });
}
createDir();

function makeDir () {
    copyAssets(assetsAdress);
    createHTML();
    createCss();
};
function createHTML () {
    console.log('я HTML')
    htmlStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));  
    fs.readdir(path.join(__dirname, 'components'), (err, content) => {
        if(err) {
            console.error;
        } else {
            let rTemplateStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
            rTemplateStream.on('readable', () => {
                let Templatedata = rTemplateStream.read();
                if (Templatedata !== null) {
                    let TemplateTxt = Templatedata.toString();
                    for(let i = 0; i < content.length; i++) {
                        let info = path.parse(content[i]);
                        fs.stat(path.join(__dirname, 'components', content[i]), (err, stats) => {
                            if (err) {
                                console.error;
                            } else if (stats.isFile() && info.ext.slice(1) == 'html') {
                                let rHTMLStream = fs.createReadStream(path.join(__dirname, 'components', content[i]), 'utf-8');
                                rHTMLStream.on('readable', () => {
                                    let itemData = rHTMLStream.read();
                                    if (itemData !== null) {
                                        TemplateTxt = TemplateTxt.replace(`{{${info.name}}}`, itemData.toString());
                                        fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), TemplateTxt, (err) => {
                                            if(err) throw err; 
                                        });
                                    }
                                });
                            }
                        })
                    }   
                } 
            })           
        }
    })
}

function createCss () {
    console.log('Я сss')
    cssStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));  
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
}

function copyAssets (adress) {
    console.log('Я assets')
    fs.mkdir(path.join(__dirname, 'project-dist', adress), err1 => {
        if(err1) {console.error;} 
     });
    fs.readdir(path.join(__dirname, adress), (err, items) => {
        if (err) { console.error }
        else {
            for(let i = 0; i < items.length; i++) {
                fs.stat(path.join(__dirname, adress, items[i]), (error, stats) => {
                    if(error) {
                    console.log('oshibka1');
                    } else if(!stats.isFile()) {
                        copyAssets(path.join(adress, items[i]));
                    } else {
                        fs.copyFile(path.join(__dirname, adress, items[i]), path.join(__dirname, 'project-dist', adress, items[i]), (err)=>{
                            if (err) {console.log('oshibka2')}
                        })
                    }
                });
            }
        }
    }); 
}

const rmFilesProm = (adress) => new Promise((res, rej) => {
    fs.readdir(adress, (err,files) => {
        if(err) {rej('error')};
        console.log('Я удаляю')
        for (let i = 0; i < files.length; i++){
            fs.stat(path.join(adress, files[i]), (error, stats) => {
                if(stats.isFile()) {
                    fs.unlink(path.join(adress, files[i]), err => {
                        if(err) {console.error}; 
                    });
                } else if(stats.isDirectory()) {
                    rmFilesProm(path.join(adress, files[i]));
                    fs.rmdir(path.join(adress, files[i]), {recursive: true, force: true}, err => {
                        if(err) {console.log('oshibka ydaleniya papki ' + files[i])};
                    });
                } else if(error) {
                    console.error;
                }
           });
        }
        res(files);
    })
})
rmFilesProm(dirAdress);

const setTimeoutPromise = () => new Promise(() => {
    setTimeout(() => {
        makeDir()
    }, 100);
});
setTimeoutPromise()