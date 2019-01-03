
const Handlebars = require('handlebars');
const fs= require('fs'); 
const path = require("path");
const FILE_OPERATES = require('./append-file');
const MKDIRS = require('./mkdir');

let mockData = (dataArr, CONF) => {
    dataArr.map(async (item) => {
        const fileName = `${item.sClassName}.json`
        const filePath = path.join(process.cwd(), CONF.MOCK_DIST, item.fullClassName);
        let dirExistsFlag = await MKDIRS.dirExistsFlag(filePath);
        console.log(dirExistsFlag, '---dirExistsFlag')
        if(dirExistsFlag === 0){//目录名和文件名冲突
            return false;
        } else {
            if(!dirExistsFlag){//已有的目录，不更新
                await MKDIRS.dirExists(filePath);
                fs.writeFile(`${path.join(filePath, fileName)}`, '', err => {
                    if(err) return console.log(err);
                })
            }
        }
    })
}


module.exports = { mockData }