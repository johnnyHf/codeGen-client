import request from "./request";
const http = {
    get(url, params = null) {
        const config = {
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        if (params) { // @ts-ignore
            config.parmas = params
        }
        return request(config)
    },
    post(url, params = null) {
        const config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }/*同理也是传入用户需要发送到后台的参数，这些参数
            放在报文中，载体表达标准是JSON*/
        if (params) { // @ts-ignore
            config.data = JSON.stringify(params)
        }
        return request(config)
    },
}

//暴露接口，允许Vue文件或其他js,ts文件使用http结构体中的方法
export default http
