
const Handlebars = require('handlebars');
const fs= require('fs'); 
const path = require("path");
const FILE_OPERATES = require('./append-file');
const MKDIRS = require('./mkdir');


let mockData = (dataArr, CONF) => {
    dataArr.map(async (item) => {
        const filePath = path.join(process.cwd(), CONF.MOCK_DIST, item.fullClassName);
        let dirExistsFlag = await MKDIRS.dirExistsFlag(filePath);
        if(!dirExistsFlag){
            await MKDIRS.dirExists(filePath);
        }
        item.paths.map(async(item2) => {
            const fileName = `${item2.path}.json`
            const fullFilePath = path.join(filePath, fileName);
            let dirExistsFlag2 = await MKDIRS.dirExistsFlag(fullFilePath);
            if(!dirExistsFlag2 & dirExistsFlag2 !== 0){
                fs.writeFile(`${fullFilePath}`, '', err => {
                    if(err) return console.log(err);
                })
            }
        })
    })
}


module.exports = { mockData }