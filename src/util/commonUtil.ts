export function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function getType(data) {
    return Object.prototype.toString.call(data).slice(8, -1);
}

export function deepClone(json) {
    // 1. 判断传进来的数据类型 如果是数组创建一个新数组 如果是对象创建一个新对象 其他情况都直接返回
    // console.log(getType(json));
    var res = {};
    if(getType(json) == 'Object'){
        res = {};
    } else if (getType(json) == 'Array'){
        res = [];
    } else {
        return json;
    }
    // 2. 把数据在复制存储一次 获取到每个数据
    for(var k in json){
        // 如果要拷贝的数据 是数组或者对象 需要进行递归拷贝
        if(getType(json[k]) == 'Object' || getType(json[k]) == 'Array'){
            res[k] = deepClone(json[k]);
        } else {
            res[k] = json[k];
        }
    }
    // 3. 返回出去
    return res;
}