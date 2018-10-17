let Config = require('../config');
let Utils = {}
Utils.deleteSpecialChar = (str, pattern) => {//删除特殊字符
    pattern = pattern || new RegExp("[` ~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\r\n]", 'g');
    return str.replace(pattern,"");
}
Utils.deleteSpace = (str, pattern) => {//删除特殊字符
    pattern = pattern || new RegExp(" ", 'g');
    return str.replace(pattern,"");
}

Utils.isKeyword = (word) => {//检测是否为js保留关键字
    let JS_KEYWORDS = ['abstract', 'arguments', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield']
    return JS_KEYWORDS.includes(word)
}

Utils.keywordFormat = (word) => {//对js关键字做转换（主要解决nei上命名的问题）
    return Utils.isKeyword(word) ? `${word}JSKey` : word
}

Utils.typeNameFormat = (typeName) => {
    return typeName ? Config.BASE_TYPES[typeName] ? Config.BASE_TYPES[typeName] : Utils.keywordFormat(Utils.deleteSpecialChar(typeName)) : 'any'
}
const LETTER = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
Utils.getIdName = (id) => {// 针对没有name只有id的interface做转换
    let LetterArr = (id + '').split('').map(num => {
       return LETTER[num]
    })
    return 'IdName' + LetterArr.join('')
}

module.exports = Utils