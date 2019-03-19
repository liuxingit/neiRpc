const fs = require("fs");  
const path = require("path");
const chalk = require('chalk');
let MKDIRS = {}
// 递归创建目录 异步方法  
MKDIRS.async = (dirname, callback) => {  
    fs.exists(dirname, function (exists) {  
        if (exists) {  
            callback();  
        } else {  
            MKDIRS.async(path.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
                //console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
            });  
        }  
    });  
}  
// 递归创建目录 同步方法
MKDIRS.sync = (dirname) => {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (MKDIRS.sync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
}


/**
 * 读取路径信息
 * @param {string} path 路径
 */
MKDIRS.getStat = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if(err){
                resolve(false);
            }else{
                resolve(stats);
            }
        })
    })
}
 
/**
 * 创建路径
 * @param {string} dir 路径
 */
MKDIRS.mkdir = (dir) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if(err){
                resolve(false);
            }else{
                resolve(true);
            }
        })
    })
}
 
/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
MKDIRS.dirExists = async (dir) => {
    let isExists = await MKDIRS.getStat(dir);
    //如果该路径且不是文件，返回true
    if(isExists && isExists.isDirectory()){
        return true;
    }else if(isExists){     //如果该路径存在但是文件，返回false
        return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir;      //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await MKDIRS.dirExists(tempDir);
    let mkdirStatus;
    if(status){
        mkdirStatus = await MKDIRS.mkdir(dir);
    }
    return mkdirStatus;
};
MKDIRS.dirExistsFlag = async (dir) => {
    let isExists = await MKDIRS.getStat(dir);
    //如果该路径且不是文件，返回true
    if(isExists && isExists.isDirectory()){
        return true;
    }else if(isExists){     //如果该路径存在但是文件，返回false
        console.log(chalk.red(`${dir}为已有文件，冲突了，请修改.neirpc.json中TPL_DIST的路径`))
        return 0;
    }
}
/**
 * 文件拷贝
 * @param {string} src 路径
 * @param {string} dst 路径
 */
MKDIRS.copy = (src, dst) => {
    fs.writeFileSync(dst, fs.readFileSync(src), err => {
        if(err) return console.log(err);
        console.log(`tpl写入成功`)
    })
    //fs.writeFileSync(dst, fs.readFileSync(src));
}

MKDIRS.copyDir = (src, dist, callback) => {
    fs.access(dist, function(err){
      if(err){
        console.log(chalk.red(err))
        // 目录不存在时创建目录
        fs.mkdirSync(dist);
      }
      _copy(null, src, dist);
    });
  
    function _copy(err, src, dist) {
        if(err){
            callback(err);
        } else {
            fs.readdir(src, function(err, paths) {
                if(err){
                    callback(err)
                } else {
                    paths.forEach(function(path) {
                        var _src = src + '/' +path;
                        var _dist = dist + '/' +path;
                        fs.stat(_src, function(err, stat) {
                            if(err){
                                callback(err);
                            } else {
                                // 判断是文件还是目录
                                if(stat.isFile()) {
                                    fs.writeFileSync(_dist, fs.readFileSync(_src));
                                } else if(stat.isDirectory()) {
                                    // 当是目录是，递归复制
                                    copyDir(_src, _dist, callback)
                                }
                            }
                        })
                    })
                }
            })
        }
    }
  }
module.exports = MKDIRS
