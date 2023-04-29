import * as React from 'react';

// main layout
import Paper from '@mui/material/Paper'

// basic elements
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import LocationOn from "@mui/icons-material/LocationOn"
import Box from '@mui/material/Box'

import AppointmentContent from './calendar/admin/AppointmentContent'

// calendar
import {
    ViewState,
    GroupingState,
    IntegratedGrouping,
    IntegratedEditing,
    EditingState,
} from '@devexpress/dx-react-scheduler'
import {
    Scheduler,

    Toolbar,
    MonthView,
    WeekView,
    ViewSwitcher,

    Resources,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    DragDropProvider,
    GroupingPanel,
} from '@devexpress/dx-react-scheduler-material-ui'
import {
    amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow, common
} from '@mui/material/colors'

const allColors = [
    [pink, "pink"],
    [red, "red"],
    [deepOrange, "deepOrange"],
    [orange, "orange"],
    [amber, "amber"],
    [yellow, "yellow"],
    [lime, "lime"],
    [lightGreen, "lightGreen"],
    [green, "green"],
    [teal, "teal"],
    [blue, "blue"],
    [lightBlue, "lightBlue"],
    [cyan, "cyan"],
    [indigo, "indigo"],
    [deepPurple, "deepPurple"],
    [purple, "purple"],
    [brown, "brown"],
    [blueGrey, "blueGrey"],
    [grey, "grey"],
]


import axios from 'axios'

import provider from "./suggest/provider.js"
import Utils from './Utils.js'

const today = new Date()
console.log(today)


var lastChanged = {}
var lastSent = {}
function sendAppointment(data) {
     if (JSON.stringify(lastSent) === JSON.stringify(data))
        return
    lastSent = data
    return axios.post('http://localhost:8081/calendar/admin/add', data)
        .then(res => {
            if (res.data.Status !== 'Success') {
                // TODO: feedback
                console.log(res)
            }
        })
        .catch(err => console.log(err))
}
var lastDeleted = {}
function deleteAppointment(data) {
     if (JSON.stringify(lastDeleted) === JSON.stringify(data))
        return
    lastDeleted = data
    return axios.post('http://localhost:8081/calendar/admin/delete', data)
        .then(res => {
            if (res.data.Status !== 'Success') {
                // TODO: feedback
                console.log(res)
            }
        })
        .catch(err => console.log(err))
}


const appointments = []

const owners = [{
    text: 'Auto',
    id: -1,
    color: indigo,
    colorName: "indigo"
}]



const locations = [
    { text: 'Mansfield', id: 1 },
    { text: 'Budd Lake', id: 2 },
]
// TODO: probably should put this onto the database


const owner = [{ text: "Schedule", id: 1 }]

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


/* app */
export default class Demo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: appointments,
            resources: [{
                fieldName: 'members',
                title: 'Members',
                instances: owners,
                default: -1,
                allowMultiple: true,
            }, {
                fieldName: 'roomId',
                title: 'Location',
                instances: locations,
            }, {
                fieldName: 'owner',
                title: 'owner',
                instances: owner,
                readonly: true
            }],
            grouping: [{
                resourceName: 'owner',
            }],

            number: 0,
            firstRender: true,

            tooltipVisible: false,
            appointmentMeta: {
                target: null,
                data: {},
            },
        }

        this.commitChanges = this.commitChanges.bind(this)
        this.toggleTooltipVisibility = () => {
            const { tooltipVisible } = this.state
            this.setState({ tooltipVisible: !tooltipVisible });
        }
        this.onAppointmentMetaChange = ({ data, target }) => {
            this.setState({ appointmentMeta: { data, target } })
        }
    }

    commitChanges({ added, changed, deleted, blockSync }) {
//         var collection = undefined
//         if (added) collection = added
//         if (changed) collection = changed
//         if (deleted) collection = deleted

        var collection = filter([added, changed, deleted])
        if (JSON.stringify(lastChanged) === JSON.stringify(collection))
            return
        lastChanged = collection

        if (added && !blockSync) {
            if (added.members[0] == -1 && added.members.length == 1) {
                added.isGhost = true

                    var slot = provider.findOpening(added.startDate, added.endDate)
                    console.log(slot)

                    added = {
                        title: added.title,
                        startDate: new Date(slot.start),
                        endDate: new Date(slot.end),
                        allDay: false,
                        members: [slot.id],
                        roomId: added.roomId,
                        notes: added.notes,
                        owner: 1,
                        slot: slot,
                        isGhost: true
                    }

                this.setState((state) => {
                    let { data } = state
                    const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0
                    data = [...data, { id: startingAddedId, ...added }]
                    return { data }
                })
                return
            }
        }
        if (added != undefined) {
            this.setState((state) => {
                let { data } = state

                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0
                data = [...data, { id: startingAddedId, ...added }]

                if (!blockSync) {
                    var syncData = {
                        name: added.title,
                        start: Utils.toJson(added.startDate),
                        end: Utils.toJson(added.endDate),
                        people: added.members,
                        place: added.roomId,
                        notes: added.notes,
                    }
                    sendAppointment(syncData)
                }

                return { data }
            })
        }

        if (deleted != undefined) {
            this.setState((state) => {
                let { data } = state
                var rm = data.filter(appointment => appointment.id === deleted)[0]

                if (!rm.isGhost) {
                    var syncData = {
                        name: rm.title,
                        start: Utils.toJson(rm.startDate),
                        end: Utils.toJson(rm.endDate),
                        people: rm.members,
                        place: rm.roomId
                    }
                    deleteAppointment(syncData)
                }

                data = data.filter(appointment => appointment.id !== deleted)
                return { data }
            })
        }

        if (changed != undefined) {
            this.setState((state) => {
                let { data } = state

                var oldToNew = Object.keys(changed).map((key, index) => {
                    let entry = changed[key]

                    var original = data.filter(appointment => appointment.id == key)[0]
                    return { original, current: entry }
                })

                console.log(oldToNew)

                Object.keys(oldToNew).forEach((key, index) => {
                    var rm = oldToNew[key].original
                    console.debug(rm)
                    var syncData = {
                        name: rm.title,
                        start: Utils.toJson(rm.startDate),
                        end: Utils.toJson(rm.endDate),
                        people: rm.members,
                        place: rm.roomId
                    }
                    deleteAppointment(syncData)

                    var current = oldToNew[key].current

                    let added = {...rm, ...current}
                    console.debug(added)

                    var addSyncData = {
                        name: added.title,
                        start: Utils.toJson(added.startDate),
                        end: Utils.toJson(added.endDate),
                        people: added.members,
                        place: added.roomId,
                        notes: added.notes,
                    }
                    sendAppointment(addSyncData)
                })

                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment))

                return { data }
            })
        }
    }

    render() {
        const { data, resources, grouping, currentViewName, firstRender, tooltipVisible, appointmentMeta } = this.state

        lastChanged = []
        lastSent = []
        lastDeleted = []

        if (this.state.firstRender) {
            this.state.firstRender = false

            /* run setup */
            getLock("people", 1)
            getLock("table", 1)

            /* add employees */
            axios.get('http://localhost:8081/getEmployee')
                .then(res => {
                    if (res.data.Status === 'Success') {
                        var { resources } = this.state

                        if (resources[0].instances.length != 1) return

                        var employees = res.data.Result

                        var lock = getLock("people", 1)
                        lock.total = employees.length

                        for (var i = 0; i < employees.length; i++) {
                            resources[0].instances = ([...resources[0].instances, {
                                text: employees[i].name,
                                id: employees[i].id,
                                color: allColors[i % allColors.length][0],
                                colorName: allColors[i % allColors.length][1]
                            }])

                            // TODO: request information about the person
                            var builder = provider.createPerson(employees[i].id)
                            builder.build()

                            lock.done += 1
                        }

                        this.setState((state) => {
                            return { resources, number: state.number + 1 }
                        })

                        return res.data
                    } else {
                        // TODO: display error
                        console.log(res)
                    }
                })
                .catch(err => console.log(err));

            /* get schedule data */
            axios.get('http://localhost:8081/calendar/admin/get')
                .then(res => {
                    if (res.data.Status === 'Success') {
                        var data = res.data.data

                        if (this.state.data.length != 0) return

                        var lock = getLock("table", 1)
                        if (data.length == 0) lock.done += 1
                        lock.total = data.length

                        for (var i = 0; i < data.length; i++) {
                            var entry = data[i]

                            var sp = entry.Assignee.split(",")
                            for (var i1 = 0; i1 < sp.length; i1++)
                                sp[i1] = parseInt(sp[i1])
                            if (sp.length == 0)
                                sp = [-1, ...sp]
                            var added = {
                                title: entry.Event,
                                startDate: new Date(entry.Start),
                                endDate: new Date(entry.End),
                                allDay: false,
                                members: sp,
                                roomId: entry.Location,
                                notes: entry.Notes,
                                owner: 1
                            }
                            this.commitChanges({ added: added, blockSync: true }, false)
                            lock.done += 1
                        }

                        return res.data
                    } else {
                        // TODO: display error
                        console.log(res)
                    }
                })
                .catch(err => console.log(err));
        }

        if (!unlocked) {
            var keys = Object.keys(locks)

            var total = 0
            var done = 0
            var missed = false

            for (var i = 0; i < keys.length; i++) {
                var lock = locks[keys[i]]
                if (lock.done < lock.total) {
                    done += lock.done
                    total += lock.total
                    missed = true
                } else {
                    done += lock.total
                    total += lock.total
                }
            }

            if (missed) {
                return (
                    <Paper>
                        <body>
                            <h1> Loading </h1>
                        </body>
                    </Paper>
                )
            }

            unlocked = true
        }

        const styles = theme => ({
            textField: {
                width: '90%',
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingBottom: 0,
                marginTop: 0,
                fontWeight: 500
            },
            input: {
                color: 'white'
            }
        });

        const content = AppointmentContent.template(this.state.data, (id) => {
            for (var i = 0; i < locations.length; i++) if (locations[i].id == id) return locations[i].text
            return "unknown"
        }, (member) => {
            var members = this.state.resources[0].instances
            for (var i = 0; i < members.length; i++) if (members[i].id == member) return members[i].text
            return indigo[300]
        }, (member) => {
            var members = this.state.resources[0].instances
            for (var i = 0; i < members.length; i++) if (members[i].id == member) return members[i].color[300]
            return indigo[300]
        }, (st) => {this.setState(st)}, this.toggleTooltipVisibility, this.onAppointmentMetaChange)

        return (
            <body>
                <Paper>
                    <Scheduler
                        data={data}
                    >
                        <EditingState
                            onCommitChanges={this.commitChanges}
                        />
                        <GroupingState
                            grouping={grouping}
                        />

                        <ViewState
                            defaultCurrentViewName="Week"
                        />

                        <WeekView
                            startDayHour={0}
                            endDayHour={24}
                            intervalCount={2}
                        />
                        <MonthView
                            startDayHour={9}
                            endDayHour={15}
                            intervalCount={2}
                        />
                        <Appointments />
                        <Resources
                            data={resources}
                            mainResourceName="owner"
                        />

                        <IntegratedGrouping />
                        <IntegratedEditing />

                        <GroupingPanel />
                        <DragDropProvider />


                        <Appointments appointmentContentComponent={content}/>
                        <AppointmentTooltip
                            showOpenButton
                            showDeleteButton
                            showCloseButton

                            visible={tooltipVisible}
                            appointmentMeta={appointmentMeta}
                            onVisibilityChange={this.toggleTooltipVisibility}
                         />

                        <AppointmentForm />

                        <Toolbar />
                        <ViewSwitcher />
                    </Scheduler>
                </Paper>
            </body>
        )
    }
}