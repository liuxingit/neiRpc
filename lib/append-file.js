const fs = require("fs"); 
const chalk = require('chalk');
const FILE_OPERATES = {}
//写入数据
FILE_OPERATES.appendFile = (data, file, msg) => {
    fs.appendFile(file, data, {},function(err){
        if(err){
            console.log(chalk.red(`${msg || ''}-- 写入失败    ${file}`))
        }else{
            if(msg){
                console.log(chalk.green(`${msg}--  写入成功`));
            }
        }
   }) 
}
FILE_OPERATES.write = (data, file, msg) => {
    fs.writeFile(file, data,function(err){
        if(err){
            console.log(chalk.red(`${msg || ''}-- 写入失败    ${file}`))
        }else{
            if(msg){
                console.log(chalk.green(`${msg}--  写入成功`));
            }
        }
    });
} 

module.exports = FILE_OPERATES;
