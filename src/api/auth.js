// 设置Token
export function setToken(data) {
  return localStorage.setItem("token", data);
}

// 获取token
export function getToken() {
  return localStorage.getItem("token");
}

// 移除token
export function removeToken() {
  localStorage.removeItem("token");
}