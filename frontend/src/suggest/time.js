export let /*long*/ DAY_LEN = ((((((24) * 60)) * 60)) * 1000);
export let /*long*/ HOUR_LEN = (((((60)) * 60)) * 1000);
export let /*long*/ MINUTE_LEN = (((60)) * 1000);
export let /*long*/ WEEK_LEN = DAY_LEN * 7;

export function /*long*/ day(/*long*/ time) {
    return Math.floor(time / DAY_LEN);
}

export function /*long*/ dayOfWeek(/*long*/ time) {
    return Math.floor(time / DAY_LEN) % 7;
//    return new Date(time).getDay();
}

export function /*long*/ from(/*int*/ hours, /*int*/ minutes) {
    return ((((((hours) * 60) + minutes) * 60)) * 1000);
}

export function /*long*/ getTime(/*String*/ day, /*long*/ time) {
    var v = time;
    switch (day.toLowerCase()) {
        case "monday":
            v += DAY_LEN;
            break
        case "tuesday":
            v += DAY_LEN * 2;
            break
        case "wednesday":
            v += DAY_LEN * 3;
            break
        case "thursday":
            v += DAY_LEN * 4;
            break
        case "friday":
            v += DAY_LEN * 5;
            break
        case "saturday":
            v += DAY_LEN * 6;
            break
        default: 
            break
    };
    return v;
}

export function timeInWeek(value) {
    var dt = new Date(value)
    var day = dt.getDay()
    var hours = dt.getHours()
    var minutes = dt.getMinutes()
    return day * DAY_LEN + hours + HOUR_LEN + minutes * MINUTE_LEN
//    return value % WEEK_LEN
}

export function /*long*/ hour(/*long*/ v) {
    return Math.floor(v / HOUR_LEN) % 24;
//    return new Date(v).getHours();
}

export function /*long*/ minute(/*long*/ v) {
    return Math.floor(v / MINUTE_LEN) % 60;
//    return new Date(v).getMinutes();
}

export function /*String*/ time(/*long*/ v) {
    var minu = minute(v).toString();
    if (minu.length == 1) minu = "0" + minu.toString();
    var dayStr = "null"
    switch (dayOfWeek(v)) {
        case 0:
            dayStr = "sunday";
            break;
        case 1:
            dayStr = "monday";
            break;
        case 2:
            dayStr = "tuesday";
            break;
        case 3:
            dayStr = "wednesday";
            break;
        case 4:
            dayStr = "thursday";
            break;
        case 5:
            dayStr = "friday";
            break;
        case 6:
            dayStr = "saturday";
            break;
        default:
            return "uh"
    };

    return dayStr + " of week " + (dayOfWeek(v)).toString() + " " + hour(v).toString() + ":" + minu
}

export function /*long*/ dayLong(/*long*/ target) {
    return day(target) * DAY_LEN;
//    return new Date(0, 0, target).getTime();
}

export function /*long*/ currentWeek() {
    var today = new Date();
    var weekStart = new Date(/* year */ today.getFullYear(), /* month */ today.getMonth(), /* day */ today.getDate() - today.getDay())
    return weekStart.getTime()
}

export default {
    currentWeek,
    dayLong,
    time,
    minute,
    hour,
    getTime,
    from,
    dayOfWeek,
    timeInWeek,
    day,
    DAY_LEN,
    WEEK_LEN,
    HOUR_LEN,
    MINUTE_LEN
}
