import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
    ViewState, GroupingState, IntegratedGrouping, IntegratedEditing, EditingState,
} from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Resources,
    Appointments,
    AppointmentTooltip,
    GroupingPanel,
    DayView,
    DragDropProvider,
    AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
    teal, indigo,
} from '@mui/material/colors';


import axios from 'axios'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()
var id = cookies.get('employee_id')

// variables and such
const appointments = []
const owners = [{
    text: 'You',
    id: -1,
    color: indigo,
    colorName: "indigo"
}]
const owner = [{ text: "Schedule", id: 1 }]

var lastChanged = []
var sentRequest = false
var unlocked = false
var locks = {}

function getLock(name, amount) {
    if (Object.hasOwn(locks, name)) return locks[name]
    locks[name] = { done: 0, total: amount }
}

function filter(values) {
    var output = []
    for (var i = 0; i < values.length; i++)
        if (values[i] != undefined)
            output.push(values[i])
    return output
}

import Time from "./suggest/time.js"

function ensureLen(str) {str = str.toString();if (str.length < 2) return "0" + str; return str}
function parseTime(dt) {
    var today = new Date(dt);
    var weekStart = new Date(/* year */ today.getFullYear(), /* month */ today.getMonth(), /* day */ today.getDate() - today.getDay())
    var timeSinceWeek = new Date(dt) - weekStart

    return ensureLen(Time.day(timeSinceWeek)) + ensureLen(Time.hour(timeSinceWeek)) + ensureLen(Time.minute(timeSinceWeek))
}

function parseData(data) {
    var starts = ""
    var ends = ""
    for (var i = 0; i < data.length; i++) {
        var entry = data[i]

        starts += (parseTime(entry.startDate))
        ends += (parseTime(entry.endDate))
    }

    return { starts, ends }
}

function sendAvailability(data) {
    return axios.post('http://localhost:8081/availability/set/' + id, data)
        .then(res => {
            if (res.data.Status !== 'Success') {
                // TODO: feedback
                console.log(res)
            }
        })
        .catch(err => console.log(err))
}

function entry(time, index) {
    return parseInt(time[index*2].toString() + time[index*2+1].toString())
}

function parseDate(time) {
    return Time.from(entry(time, 1), entry(time, 2)) + (entry(time, 0) * Time.DAY_LEN)
}

export default class Demo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: appointments,
            resources: [{
                fieldName: 'owner',
                title: 'owner',
                instances: owner,
                readonly: true
            }],
            grouping: [{
                resourceName: 'owner',
            }],
        };

        this.commitChanges = this.commitChanges.bind(this);
    }

    commitChanges({ added, changed, deleted, blockSync }) {
    console.log(added)
        var collection = filter([added, changed, deleted])
        if (JSON.stringify(lastChanged) === JSON.stringify(collection))
            return
        lastChanged = collection

        if (added != undefined) {
            this.setState((state) => {
                let { data } = state

                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0
                data = [...data, { id: startingAddedId, ...added }]

                if (!blockSync) {
                    var availabilityData = parseData(data)
                    var syncData = {
                        start: availabilityData.starts,
                        end: availabilityData.ends,
                    }
                    sendAvailability(syncData)
                }

                return { data }
            })
        }

        if (deleted != undefined) {
            this.setState((state) => {
                let { data } = state
                var rm = data.filter(appointment => appointment.id === deleted)[0]
                data = data.filter(appointment => appointment.id !== deleted)

                var availabilityData = parseData(data)
                var syncData = {
                    start: availabilityData.starts,
                    end: availabilityData.ends,
                }
                sendAvailability(syncData)

                return { data }
            })
        }

        if (changed != undefined) {
            this.setState((state) => {
                let { data } = state
                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment))

                var availabilityData = parseData(data)
                var syncData = {
                    start: availabilityData.starts,
                    end: availabilityData.ends,
                }
                sendAvailability(syncData)

                return { data }
            })
        }
    }

    render() {
        const { data, resources, grouping } = this.state;

        if (!sentRequest) {
            sentRequest = true

            axios.post("http://localhost:8081/availability/get/" + id)
                .then(res => {
                    console.log(res)
                    if (res.data.Status === 'Success') {
                        var data = res.data.data
                        console.log(data)
                        if (data.length == 0) return

                        var entry = data[0]
                        var openings = entry.Openings
                        var endings = entry.Durations

                        while (true) {
                            if (!openings) break

                            var opening = openings.substring(0, 6)
                            openings = openings.substring(6)
                            var closing = endings.substring(0, 6)
                            endings = endings.substring(6)

                            var start = new Date("Sun Jan 01 2023 00:00:00 GMT-0500 (Eastern Standard Time").getTime()

                            var startTime = parseDate(opening) + start
                            var added = {
                                    startDate: new Date(parseDate(opening) + start),
                                    endDate: new Date(parseDate(closing) + start),
                                    "allDay": false,
                                    "owner": 1
                            }
                            console.log(added)
                            this.commitChanges({ added, blockSync: true })
                        }
                    }
                })
                .catch(err => console.log(err))
        }

        return (
            <Paper>
                <Scheduler data={data}>
                    <ViewState defaultCurrentDate="2023-01-01"/>
                    <EditingState onCommitChanges={this.commitChanges}/>
                    <GroupingState grouping={grouping}/>

                    <DayView
                        startDayHour={9}
                        endDayHour={15}
                        intervalCount={7}
                    />
                    <Appointments />
                    <Resources
                        data={resources}
                        mainResourceName="owner"
                    />

                    <IntegratedGrouping />
                    <IntegratedEditing />

                    <AppointmentTooltip showDeleteButton showOpenButton showCloseButton />
                    <AppointmentForm />
                    <GroupingPanel />
                    <DragDropProvider />
                </Scheduler>
            </Paper>
        );
    }
}