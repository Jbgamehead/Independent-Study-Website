var people = {}
var peopleList = []

import Opening from "./person.js"
import Person from "./person.js"
import schedule from "./schedule.js"
import Time from "./time.js"

function entry(time, index) {
    return parseInt(time[index*2].toString() + time[index*2+1].toString())
}

function parseDate(time) {
    return Time.from(entry(time, 1), entry(time, 2)) + (entry(time, 0) * Time.DAY_LEN)
}

export class PersonBuilder {
    constructor(id) {
        this.id = id
        this.openings = []

        this.addOpening("020100", "020330")
    }

    addOpening(start, end) {
        this.openings.push(new Opening.Opening(parseDate(start), parseDate(end)))
    }

    build() {
        var per = new Person.Person(this.id, this.openings)
        people[name] = per
        peopleList.push(per)
        return per
    }
}

export class Slot {
    constructor(id, person, start, end) {
        this.id = id
        this.person = person
        this.start = start
        this.end = end
    }

    submit() {
        this.person.schedule((this.start + this.end) / 2)
    }
}

export function createPerson(name) {
    return new PersonBuilder(name)
}

function ensureLen(str) {str = str.toString();if (str.length < 2) return "0" + str; return str}
function timeToString(tm) {return Time.day(tm) + " " + ensureLen(Time.hour(tm)) + ":" + ensureLen(Time.minute(tm))}

export function findOpening(start, end) {
    var duration = end - start
    var inWeek = Time.timeInWeek(start)
    var suggestion = schedule.schedule(start, inWeek, duration, peopleList)

    var today = new Date();
    var weekStart = new Date(/* year */ today.getFullYear(), /* month */ today.getMonth(), /* day */ today.getDate() - today.getDay())

    var suggested = suggestion.v

    var start = weekStart.getTime()
    start += Time.day(suggested) * Time.DAY_LEN
    start += Time.hour(suggested) * Time.HOUR_LEN
    start += Time.minute(suggested) * Time.MINUTE_LEN

    var id = suggestion.t.id

    return new Slot(id, suggestion.t, start, start + duration)
}

export default {
    PersonBuilder,
    createPerson,
    findOpening
}
