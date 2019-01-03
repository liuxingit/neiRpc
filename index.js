const chalk = require('chalk');
const fs = require("fs"); 
const path = require("path");
const MKDIRS = require('./lib/mkdir');
const getNeiData = require('./lib/nei-data');
const CONF = require('./config');

const createInterface = async (config) => {
    Object.assign(CONF, config || {})
    let hasGroupName = CONF.GROUP_NAME && CONF.GROUP_NAME.length
    if(!hasGroupName){
        console.log(chalk.keyword('orange')('请注意你的./neiRpc.json配置文件中GROUP_NAME未设置，默认拉取工程下所有接口……'))
    }
    //创建路径
    await MKDIRS.dirExists(path.join(process.cwd(), CONF.ROUTER_DIST));
    await MKDIRS.dirExists(path.join(process.cwd(), CONF.API_DIST));
    await MKDIRS.dirExists(path.join(process.cwd(), CONF.SERVICE_DIST));
    await MKDIRS.dirExists(path.join(process.cwd(), CONF.CONTROLLER_DIST));
    await MKDIRS.dirExists(path.join(process.cwd(), CONF.MOCK_DIST));
    let dirExistsFlag = await MKDIRS.dirExistsFlag(path.join(process.cwd(), CONF.TPL_DIST));
    if(dirExistsFlag === 0){//目录名和文件名冲突
        return false;
    } else {
        if(!dirExistsFlag){//已有目录，不更新
            await MKDIRS.dirExists(path.join(process.cwd(), CONF.TPL_DIST));
            await MKDIRS.copyDir(path.join(__dirname,'./lib/tpl'), path.join(process.cwd(), CONF.TPL_DIST), (err) => {console.log(chalk.red(`${err}`))});
        } else {
            console.log(chalk.keyword('orange')(`请注意你的${CONF.TPL_DIST}模板目录已经存在，不会重复拉取，如需更新请删除目录后重新执行命令……`))
        }
        fs.writeFile(path.join(process.cwd(), CONF.ROUTER_DIST, 'router' + (CONF.SERVER_TS ? '.ts' : 'js')), '', err => {
            if(err) return console.log(err);
            console.log(chalk.blue('文件创建完毕，开始获取数据并写入……'));
            getNeiData(CONF)
        })
    }
    
};

module.exports = createInterface;