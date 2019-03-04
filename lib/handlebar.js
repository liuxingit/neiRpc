
const Handlebars = require('handlebars');
const fs= require('fs'); 
const path = require("path");
const FILE_OPERATES = require('./append-file');
let CONF = {};

Handlebars.registerHelper("ifExpress",function(a,b,options){
    if(a === b){
        return options.fn(this);//这个就相当于满足这个条件，执行ifExpress下面的一段代码
    }else{
        return options.inverse(this);//表示不选择这个，选择else
    }
});

let tplCompile = (name, item, tmpfileName) => {
    var source = fs.readFileSync(path.join(process.cwd(), CONF.TPL_DIST, `${name === 'api' && tmpfileName === 'index' ? 'apiIndex' : name}.hbs`),'utf-8');
    var template = Handlebars.compile(source);
    var result = template({item: item});
    const fileName = (tmpfileName || item.sClassName) + (CONF[name === 'api' ? 'CLIENT_TS' : 'SERVER_TS'] ? '.ts' : '.js');
    const fileFullName = `${path.join(process.cwd(), CONF[name.toUpperCase() + '_DIST'], fileName)}`;
    FILE_OPERATES.write(result, fileFullName, `${name}.${item.sClassName ? item.sClassName : 'default'}`)
}

let HandlebarsCompile = (dataArr, tmpCONF) => {
    CONF = tmpCONF;
    const NAME_ARR = ['service', 'controller', 'router', 'api']
    NAME_ARR.map(name => {
        if(name === 'router'){
            tplCompile(name, dataArr, name)
        } else {
            if(name === 'api'){
                tplCompile(name, dataArr, 'index')
            }
            dataArr.map(item => {
                tplCompile(name, item);
            })
        }
    })
    
}


module.exports = {HandlebarsCompile}