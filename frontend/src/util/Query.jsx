import axios from 'axios'
import { useCookies } from 'react-cookie'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()

function merge(newContent, old) {
    var output = {
        ...newContent,
        ...old
    }
    return output
}

function get(url, data) {
    var merged = merge({token: cookies.get("token"), ...data})
    return axios.post(url, merged)
}
function post(url, data) {
    var merged = merge({token: cookies.get("token"), ...data})
    return axios.post(url, merged)
}
function put(url, data) {
    var merged = merge({token: cookies.get("token"), ...data})
    return axios.post(url, merged)
}
function del(url, data) {
    var merged = merge({token: cookies.get("token"), ...data})
    return axios.post(url, merged)
}

export default {
    get, post, put, del
}
