import Pair from "./pair.js"
import Opening from "./person.js"
import Person from "./person.js"
import time from "./time.js"


function /*long*/ calcAltMethod(/*long*/ target, /*long*/ duration, /*Person*/ person) {
    return person.closestExisting(target);
}

function /*Pair<Person, Long>*/ schedule(/*long*/ target, /*long*/ duration, /*List<Person>*/ people) {
    var altMetric = false;
    var bestRating = Long.MAX_VALUE;
    var bestPerson = null;
    var timeSched = 0;

    for (var personIndex = 0; personIndex < people.length; personIndex++) {
        var person = people[personIndex]


        var rating = Long.MAX_VALUE;
        var valid = -1;

        if (person.canOpen(duration)) {
            valid = person.closestTime(target, duration);
            rating = Math.abs(valid - target);
        }
        if (altMetric) {
            if (rating > duration) continue;
            rating = calcAltMethod(target, duration, person);
        } else if (rating <= duration) {
            altMetric = true;
            rating = calcAltMethod(target, duration, person);

            bestRating = rating;
            bestPerson = person;
            timeSched = valid;
        }

        if (altMetric ? (rating > bestRating) : (rating < bestRating)) {
            bestRating = rating;
            bestPerson = person;
            timeSched = valid;
        } else if (rating == bestRating) {
            if (bestPerson == null) {
                bestPerson = person;
                continue;
            }

            var alt0 = calcAltMethod(target, duration, bestPerson);
            var alt1 = calcAltMethod(target, duration, person);
            if (alt1 > alt0) {
                bestPerson = person;
                timeSched = valid;
            }
        }
    }

    return new Pair(bestPerson, timeSched);
}

export default {
    schedule
}
