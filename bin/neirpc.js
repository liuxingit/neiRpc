#!/usr/bin/env node
const path = require('path');
const chalk = require('chalk');
const program = require('commander');
const fs = require("fs"); 
let createInterface = require('../index.js')
let packConfig = require('../package.json')

program
    .version(packConfig.version)
    .option('-c --config [value]', '指定project的neirpc.json')
    .parse(process.argv)

if(program.config){
    let configPath = path.join(process.cwd(), program.config)
    fs.exists(configPath, (exists) => {
        if(exists){
            createInterface(JSON.parse(fs.readFileSync(configPath)))
        }
        if(!exists){
            console.log(chalk.red(`${configPath} 文件不存在`))
        }
    })
} else {
    console.log(chalk.red('config不存在哦'))
}


