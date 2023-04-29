import time from "./time.js"

export class Opening {
    isOpen(/*long*/ start, /*long*/ end) {
        start %= time.WEEK_LEN;
        end %= time.WEEK_LEN;

        return this.start <= start && this.end >= end;
    }

    getValid(/*long*/ target, /*long*/ duration) {
        if (isOpen(target % Time.WEEK_LEN, duration + start)) return target;
        if (isOpen(end - duration, end)) {
            var offset = start - (target % Time.WEEK_LEN);
            var v0 = offset + (end - duration); // first available time from end
            var v1 = start + Time.dayLong(target); // first available time from start
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
}

export class Person {
    constructor(/*Opening[]*/ availability) {
        this.availability = availability
        this.scheduledFor = []
    }

    timeSinceSchedule(/*long*/ cTime) {
        var min = Long.MAX_VALUE
        for (var i = 0; i < scheduledFor.length; i++) {
            var cTime = scheduledFor[i]
            min = Math.min(Math.abs(cTime - l), min)
        }
        return min
    }

    closestTime(/*long*/ target, /*long*/ duration) {
        var delta = Long.MAX_VALUE;
        var best = -1;

        for (var i = 0; i < availability.length; i++) {
            var opening = availability[i]

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
        for (var i = 0; i < availability.length; i++)
            if (availability[i].isOpen(start, end))
                return true;
        return false;
    }

    canOpen(/*long*/ duration) {
        for (var i = 0; i < availability.length; i++)
            if (availability[i].isOpen(opening.start, opening.start + duration))
                return true;
        return false;
    }

    schedule(/*long*/ v) {
        var scheduledNumbers = []
        var current = new Date();
        var time = current.getTime() - Time.WEEK_LEN;
        scheduledNumbers.push(v);

        for (var i = 0; i < scheduledFor.length; i++) {
            var l = scheduledFor[i]
            if (l < time) continue;
            scheduledNumbers.push(l);
        }
        scheduledFor = values;
    }

    closestExisting(/*long*/ target) {
        var delta = Long.MAX_VALUE;
        for (var i = 0; i < scheduledFor.length; i++)
            delta = Math.min(delta, Math.abs(scheduledFor[i] - target));
        return delta;
    }
}


export default {
    Opening,
    Person,
}
