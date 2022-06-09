// 首字母大写
export const titleCase = (str) => {
    return str.slice(0,1).toUpperCase() +str.slice(1).toLowerCase();
}
// 字符串下划线转驼峰
export const formatToHump = (value) => {
    return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
}

// 字符串驼峰转下划线
export const formatToLine = (value) => {
    return value.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 数据对象key 驼峰下划线互相转化
 * @param {Object} data 需要转换的对象
 * @param {String} type hump-转驼峰 toLine-转下划线
 */
export const formatHumpLineTransfer = (data, type = 'hump') => {
    let hump = ''
    // 转换对象中的每一个键值为驼峰的递归
    const formatTransferKey = (data) => {
        if (data instanceof Array) {
            data.forEach(item => formatTransferKey(item))
        } else if (data instanceof Object) {
            for (const key in data) {
                hump = type === 'hump' ? formatToHump(key) : formatToLine(key)
                data[hump] = data[key]
                if (key !== hump) {
                    delete data[key]
                }
                if (data[hump] instanceof Object) {
                    formatTransferKey(data[hump])
                }
            }
        } else if (typeof data === 'string') {
            data = type === 'hump' ? formatToHump(data) : formatToLine(data)
        }
    }
    formatTransferKey(data)
    return data
}
