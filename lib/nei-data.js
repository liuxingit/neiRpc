const chalk = require('chalk');
const path = require("path");
const FILE_OPERATES = require('./append-file');
const { initRequest, request } = require('./request')
const { HandlebarsCompile } = require('./handlebar');
const { deleteSpecialChar } = require('./util');
const { mockData } = require('./mock');
let CONF = {}

let index = 0,
    ajaxCount = 0,
    successAjaxCount = 0 // 用以记录获取到的接口数量，包含成功失败

//获取项目所有的接口信息
async function getRPCS() {
    let res = await request('3api/rpcs', {
        data: {
            pid: CONF.PROJECT_ID,
        }
    })
    if (!res) {
        return false
    }
    console.log(chalk.blue(`基础接口数据获取成功……`))
    index = 0;
    ajaxCount = 0;
    successAjaxCount = 0;
    let rpcs = res.result;
    let rpcFilterLen = 0;
    let AllClassNamePath = {};
    rpcs.map(function(item) {
        //ajaxCount ++;
        let groupName = (item.group || {}).name || '';
        if (!(CONF.GROUP_NAME || []).length || CONF.GROUP_NAME.includes(groupName)) {
            rpcFilterLen++;
            let className = (item.className || '').split('.')
            className = className[className.length - 1];
            let sClassName = className;
            sClassName = sClassName ? sClassName[0].toLowerCase() + sClassName.substring(1) : ''

            let groupName = (item.group || {}).name || '';
            const protocol = groupName && CONF.PROTOCOL && CONF.PROTOCOL[groupName] ? CONF.PROTOCOL[groupName] : 'jsonrpc';
            if (!AllClassNamePath[sClassName]) {
                AllClassNamePath[sClassName] = {
                    fullClassName: item.className,
                    className,
                    sClassName: sClassName,
                    protocol,
                    // name: item.name,
                    // description: item.description,
                    // realname: item.respo && item.respo.realname ? item.respo.realname : '-',
                    paths: []
                }
            }
            //排序
            const pattern = new RegExp('\\b' + CONF.TAG + '\\b')
            AllClassNamePath[sClassName].paths.push({
                sClassName: sClassName,
                id: item.id,
                protocol,
                method: pattern.test(item.tag) ? 'get' : 'post',
                path: item.path,
                params: [],
                name: item.name,
                groupName,
                description: deleteSpecialChar(item.description),
                realname: item.respo && item.respo.realname ? item.respo.realname : '-',
            })
            AllClassNamePath[sClassName].paths.sort(function(a, b) {
                return a.path > b.path ? 1 : -1
            })
        }
    })
    let AllClassNamePathArr = []
    for (let key in AllClassNamePath) {
        if (AllClassNamePath[key]) {
            AllClassNamePathArr.push(AllClassNamePath[key])
        }
    }
    AllClassNamePathArr.sort(function(a, b) {
        return a.sClassName > b.sClassName ? 1 : -1
    })

    //console.log(JSON.stringify(rpcs, null, 4))
    //console.log(JSON.stringify(AllClassNamePathArr, null, 4))
    //console.log(JSON.stringify(AllClassNamePathArr[0].paths[0], null, 4))
    AllClassNamePathArr.map((item) => {
        item.paths.map((item2) => {
            getRpcById(item2, item.className)
        })
    })



    let st = setInterval(function() {
        if (rpcFilterLen === ajaxCount) {
            clearInterval(st)
            console.log(chalk.blue(`共${ajaxCount}个ajax接口数据，其中${successAjaxCount}个获取成功……`))
                //给controller用
            AllClassNamePathArr.map(item => {
                    item.paths.map(item2 => {
                        (item2.params || []).map((param) => {
                            const typeName = param.typeName;
                            if (!param.datatypeName && CONF.TYPE_SWITCH[typeName] && !param.isArray) {
                                param.subName = `${CONF.TYPE_SWITCH[typeName]}(${param.name})`
                            }
                        });
                        (item2.params || []).sort(function(a, b) {
                            return a.position === b.position ? 0 : a.position > b.position ? 1 : -1;
                        })
                    })

                })
                //按照类名创建文件
                //把数据写入mock.json
            if (CONF.RPC_DATA) {
                const fileFullName = `${path.join(process.cwd(), 'mock.json')}`;
                FILE_OPERATES.write(JSON.stringify(AllClassNamePathArr, null, 4), fileFullName, `rpc的数据`)
            }
            mockData(AllClassNamePathArr, CONF)
            HandlebarsCompile(AllClassNamePathArr, CONF)
        }
    }, 200)

}

//获取某个ajax接口的入参和返回
async function getRpcById(item2, className) {
    index++;
    console.log(`${index}: 获取 ${className}/${item2.path} 中……`)
    let res = await request('3api/rpcs/' + item2.id)
    ajaxCount++
    if (!res) {
        console.error(`${index}: 获取 ${className}/${item2.path} 失败`)
        return false
    }
    console.log(`获取 ${className}/${item2.path} 成功！`)
    successAjaxCount++
    let rpcById = res.result || {};
    let params = rpcById.params || {};
    item2.params = params.inputs || [];
    if (item2.params && item2.params.length) {
        let ALL_datatypeName = {};
        item2.params.map(pathItem => {
            if(pathItem.datatypeName){
                if(!ALL_datatypeName[pathItem.datatypeName]){
                    ALL_datatypeName[pathItem.datatypeName] = []
                };
                ALL_datatypeName[pathItem.datatypeName].push(pathItem.name);
            }
        })
        if(ALL_datatypeName && Object.keys(ALL_datatypeName).length){
            for(let i = 0; i < item2.params.length; i++){
                let pathItem = item2.params[i];
                if(pathItem.datatypeName){
                    console.log(chalk.blue(`${JSON.stringify(ALL_datatypeName[pathItem.datatypeName], null, 4)}--ALL_datatypeName[pathItem.datatypeName]`))

                    
                    const i2 = ALL_datatypeName[pathItem.datatypeName].indexOf(pathItem.name);
                    console.log(chalk.blue(`${i2}--index`))
                    if(i2 === 0){
                        pathItem.name = pathItem.datatypeName;
                        pathItem.typeName = pathItem.datatypeName;
                        pathItem.innerParams = ALL_datatypeName[pathItem.datatypeName];

                    } else if(i2 > 0){
                        item2.params.splice(i, 1);
                        i--;
                    }
                };

            }
            // item2.params.map((pathItem, index) => {
            //     if(pathItem.datatypeName){
            //         console.log(chalk.blue(`${JSON.stringify(ALL_datatypeName[pathItem.datatypeName], null, 4)}--ALL_datatypeName[pathItem.datatypeName]`))

                    
            //         const i = ALL_datatypeName[pathItem.datatypeName].indexOf(pathItem.name);
            //         console.log(chalk.blue(`${i}--index`))
            //         if(i === 0){
            //             pathItem.name = datatypeName;
            //             pathItem.innerParams = ALL_datatypeName[pathItem.datatypeName];

            //         } else if(i > 0){
            //             item.params.split(index, 1)
            //         }
            //     };
            // })
        }
        //item2.datatypeName = item2.params[0].datatypeName
    }
}

let getNeiData = (config) => {
    CONF = config
    initRequest(CONF)
    getRPCS()
}
module.exports = getNeiData;