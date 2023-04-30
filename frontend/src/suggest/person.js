import time from "./time.js"

function ensureLen(str) {str = str.toString();if (str.length < 2) return "0" + str; return str}
function timeToString(tm) {return time.day(tm) + " " + ensureLen(time.hour(tm)) + ":" + ensureLen(time.minute(tm))}

export class Opening {
    isOpen(/*long*/ start, /*long*/ end) {
        return this.start <= start && this.end >= end;
    }

    getValid(/*long*/ target, /*long*/ duration) {
        if (this.isOpen(target, duration + target))
            return target;
        if (this.isOpen(this.end - duration, this.end)) {
            var v0 = this.start
            var v1 = this.end - duration

            if (Math.abs(v0 - target) < Math.abs(v1 - target))
                return v0;
            return v1;
        }
        return -1;
    }

    constructor(/*long*/ start, /*long*/ end) {
        this.start = start;
        this.end = end;
    }

    from(/*String*/ day, /*long*/ timeStart, /*long*/ timeEnd) {
        this.start = time.getTime(day, timeStart);
        this.end = time.getTime(day, timeEnd);
    }

    toString() {
        var json = {
            start: timeToString(this.start),
            end: timeToString(this.end)
        }
        return JSON.stringify(json)
    }
}

export class Person {
    constructor(id, /*Opening[]*/ availability) {
        this.id = id
        this.availability = availability
        this.scheduledFor = []
    }

    timeSinceSchedule(/*long*/ cTime) {
        var min = Number.MAX_VALUE
        for (var i = 0; i < this.scheduledFor.length; i++) {
            var cTime = this.scheduledFor[i]
            min = Math.min(Math.abs(cTime - l), min)
        }
        return min
    }

    closestTime(/*long*/ target, /*long*/ duration) {
        var delta = Number.MAX_VALUE;
        var best = -1;

        for (var i = 0; i < this.availability.length; i++) {
            var opening = this.availability[i]

            var valid = opening.getValid(target, duration);
            if (valid == -1) continue;

            var cdelt = Math.abs(valid - target);
            if (cdelt < delta) {
                delta = cdelt;
                best = valid;
            }
        }

        return best;
    }

    isOpen(/*long*/ start, /*long*/ end) {
        for (var i = 0; i < this.availability.length; i++)
            if (this.availability[i].isOpen(start, end))
                return true;
        return false;
    }

    canOpen(/*long*/ duration) {
        for (var i = 0; i < this.availability.length; i++) {
            var opening = this.availability[i]
            if (opening.isOpen(opening.start, opening.start + duration))
                return true
        }
        return false;
    }

    schedule(/*long*/ v) {
        var scheduledNumbers = []
        scheduledNumbers.push(v);

        for (var i = 0; i < this.scheduledFor.length; i++) {
            var l = this.scheduledFor[i]
            scheduledNumbers.push(l);
        }
        this.scheduledFor = scheduledNumbers;
    }

    unschedule(/*long*/ v) {
        var scheduledNumbers = []
        scheduledNumbers.push(v);

        for (var i = 0; i < this.scheduledFor.length; i++) {
            var l = this.scheduledFor[i]
            if (l != v) scheduledNumbers.push(l)
        }
        this.scheduledFor = scheduledNumbers
    }

    closestExisting(/*long*/ target) {
        var delta = Number.MAX_VALUE;
        for (var i = 0; i < this.scheduledFor.length; i++)
            delta = Math.min(delta, Math.abs(this.scheduledFor[i] - target));
        return delta;
    }
}


export default {
    Opening,
    Person,
}
