let /*long*/ DAY_LEN = ((((((24) * 60)) * 60)) * 1000);
let /*long*/ HOUR_LEN = (((((60)) * 60)) * 1000);
let /*long*/ MINUTE_LEN = (((60)) * 1000);
let /*long*/ WEEK_LEN = DAY_LEN * 7;

function /*long*/ day(/*long*/ time) {
    return time / DAY_LEN;
}

function /*long*/ dayOfWeek(/*long*/ time) {
    return (time / DAY_LEN) % 7;
}

function /*long*/ from(/*int*/ hours, /*int*/ minutes) {
    return ((((((hours) * 60) + minutes) * 60)) * 1000);
}

function /*long*/ getTime(/*String*/ day, /*long*/ time) {
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

function /*long*/ hour(/*long*/ v) {
    return (v / HOUR_LEN) % 24;
}

function /*long*/ minute(/*long*/ v) {
    return (v / MINUTE_LEN) % 60;
}

function /*String*/ time(/*long*/ v) {
    var min = String.valueOf(minute(v));
    if (min.length() == 1) min = "0" + min.toString();
    var day = "null"
    switch (dayOfWeek(v)) {
        case 0:
            day = "sunday";
            break
        case 1:
            day = "monday";
            break
        case 2:
            day = "tuesday";
            break
        case 3:
            day = "wednesday";
            break
        case 4:
            day = "thursday";
            break
        case 5:
            day = "friday";
            break
        case 6:
            day = "saturday";
            break
        default:
            return "uh"
    };

    return
            day + " of week " + (day(v) / 7).toString() + " " + hour(v).toString() + ":" + min.toString();
}

function /*long*/ dayLong(/*long*/ target) {
    return day(target) * DAY_LEN;
}

function /*long*/ currentWeek() {
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
    day
}