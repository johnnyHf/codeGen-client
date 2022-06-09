import http from "./http";

// 获取验证码，这个函数指的是使用GET请求请求目标服务器的
export function getCaptcha() {
    return http.get("/captcha")
}
// 验证用户名\密码，这里指的是使用POST方法请求Login接口，并携带params对象作为参数。
export function verifyUserNameAPI(params) {
    return http.post("/login", params)
}

export function getDatabaseTables(database) {
    return http.post("/table/list", {
        "database": database
    })
}

export function getTemplate() {
    return http.post("/template/list", {})
}

export function getProject(option) {
    if (!option) {
        option = {};
    }
    return http.post("/project/list", option)
}

export function generateCode(data) {
    return http.post("/template/gen", data)
}