


function toJson(date) {
    return {
        "y": date.getFullYear(),
        "m": date.getMonth(),
        "d": date.getDate(),
        "h": date.getHours(),
        "mi": date.getMinutes(),
        "s": date.getSeconds(),
        // I think seconds are pushing it on what's required for this, lol
    }
}

export default {
    toJson
}
