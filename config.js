// 关于nei 内部查询接口的文档 https://nei.netease.com/project?pid=27248，加入该项目即可看到具体接口信息
const Config = {
    // PLATFORM_ID: 0,//找杭研 nei后端 @包勇明 获取 platformId //tip: 自行设置
    // SALT: 'abc',//找杭研 nei后端 @包勇明 获取 salt  //tip: 自行设置
    // PROJECT_ID: 0, // nei 页面url 即可获取  //tip: 自行设置
    HOSTNAME: 'nei.netease.com',
    PLATFORM_ID: 11111,
    SALT: "XXXXX",
    PROJECT_ID: 22222,
    TAG: "get",//标志 怎么区分get or post请求
    SERVER_TS: true,
    CLIENT_TS: false,
    TPL_DIST: "./neiRpcTpl",//配置模版防止文件
    API_DIST: "./client/src/api", //ajax存放路径
    SERVICE_DIST: "./server/app/service", //server存放路径
    CONTROLLER_DIST: "./server/app/controller",
    ROUTER_DIST: "./server/app",
    MOCK_DIST: "./server/mock",
    PROTOCOL: {},// 各组支持的协议，默认jsonrpc
    GROUP_NAME: [],//业务分组，只拉取该分组下的接口数据
    CUSTOMIZE_GROUP: [],
    TYPE_SWITCH: {
        Number: "Number"
    },//入参需要做强制转换的数据类型,跟NEI类型一致
    RPC_DATA: false
}
module.exports = Config