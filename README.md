# neirpc

- 利用nei内部查询数据接口，获取数据
- 生成node层的controller、service、router，以及client的api
（参考KAPP）

# 更新记录
- 1.1.0 版本及以后支持了dubbo协议和jsonrpc协议两种，默认为jsonrpc
- 1.1.0 版本及以后修改了TYPE_SWITCH配置（不使用则无影响）
# tips
- 后端nei上定义的rpc接口入参可为对象，也可为参数平铺，注意参数平铺则强依赖后端参数顺序
- nei接口的标签，标注.neirpc.json中的TAG值的为get请求，不标注默认生成post请求
- get请求参数会转换为string，所以controller有个转换，只处理number类型

# config 参数说明


```
{
    HOSTNAME: 'nei.netease.com',
    PLATFORM_ID: XXX, //找杭研 nei后端 @包勇明 获取 platformId 
    SALT: "", //找杭研 nei后端 @包勇明 获取 salt 
    PROJECT_ID: 0, //nei 页面url 即可获取
    TAG: "get",//标志 怎么区分get or post请求，如果不满足一律为post请求
    SERVER_TS: true, //server 层是否使用ts
    CLIENT_TS: true, //client 层是否使用ts
    TPL_DIST: "./neiRpcTpl",//配置模版防止文件
    API_DIST: "./client/src/api", // api 存放的目录位置
    SERVICE_DIST: "./server/app/service", //node 的service层
    CONTROLLER_DIST: "./server/app/controller", //node 的controller层
    ROUTER_DIST: "./server/app", //node 的 存放 router的目录
    GROUP_NAME: ['AA组', 'BB组'],//业务分组，只拉取该分组下的接口数据
    PROTOCOL: {
        'AA组': 'dubbo'
    },// 各组支持的协议，默认jsonrpc
    TYPE_SWITCH: {
        Number: "Number"
    },//入参需要做强制转换的数据类型,跟NEI类型一致
    RPC_DATA: false//命令执行路径下生成rpc的接口数据，主要用于debugger
}
```



# Usage

npm i neirpc.js -g (最好全局安装)

第一种用法：

```
创建项目的 .neirpc.json文件
{
    PLATFORM_ID: XXX, //找杭研 nei后端 @包勇明 获取 platformId 
    SALT: "", //找杭研 nei后端 @包勇明 获取 salt 
    PROJECT_ID: 0, //nei 页面url 即可获取
    ……其他参数覆盖自己设置即可
}

执行 neirpc -c .neirpc.json 命令，自动更新接口文件 // 每次nei定义的接口声明变更都需要运行此命令哦
```


第二种用法
```
在gulpfile.js中配置任务

let neirpc = require('neirpc');
let config = require('./.neiRpc.json')

gulp.task('rpc', () => {
    neirpc(config)
});

gulp rpc //生成node层的controller、service、router，以及client的api
```
