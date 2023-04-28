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

import Utils from './Utils.js'

const today = new Date()
console.log(today)


var lastAdded = {}
function sendAppointment(data) {
    return axios.post('http://localhost:8081/calendar/admin/add', data)
        .then(res => {
            if (res.data.Status !== 'Success') {
                // TODO: feedback
                console.log(res)
            }
        })
        .catch(err => console.log(err))
    ;
}


const appointments = []

const owners = [{
    text: 'Auto',
    id: -1,
    color: indigo,
    colorName: "indigo"
}]

// TODO: request employees from database


const locations = [
    { text: 'Mansfield', id: 1 },
    { text: 'Budd Lake', id: 2 },
]
// TODO: probably should put this onto the database


const staticValue = [
    { text: "default", id: 1, color: indigo }
]

var sentRequest = false
var unlocked = false
var locks = {}

function getLock(name, amount) {
    if (Object.hasOwn(locks, name)) return locks[name]
    locks[name] = {done: 0, total: amount}
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
                fieldName: 'staticValue',
                title: 'staticValue',
                instances: staticValue
            }],
            grouping: [{
                resourceName: 'staticValue',
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
        if (added && !blockSync) {
            if (added.members[0] == -1 && added.members.length == 0) {
                return
            }
        }
        this.setState((state) => {
            let { data } = state
            if (added) {
                if (lastAdded == added)
                    return
                lastAdded = added

                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
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
            }
            if (changed) {
                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment))
            }
            if (deleted !== undefined) {
                data = data.filter(appointment => appointment.id !== deleted)
            }

            return { data }
        })
    }

    currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName })
    }

    render() {
        const { data, resources, grouping, currentViewName, firstRender, tooltipVisible, appointmentMeta } = this.state

        if (this.state.firstRender) {
            /* run setup */
            getLock("people", 1)

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
        }

        this.state.firstRender = false

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

            /* get schedule data */
            axios.get('http://localhost:8081/calendar/admin/get')
                .then(res => {
                    if (res.data.Status === 'Success') {
                        var data = res.data.data

                        if (this.state.data.length != 0) return

                        for (var i = 0; i < data.length; i++) {
                            var entry = data[i]
                            console.log(entry)

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
                                staticValue: 1
                            }
                            this.commitChanges({added: added, blockSync: true}, false)
                        }

                        return res.data
                    } else {
                        // TODO: display error
                        console.log(res)
                    }
                })
                .catch(err => console.log(err));
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
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].id == id) return locations[i].text
            }
            return "[Location not found]"
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
                            startDayHour={9}
                            endDayHour={15}
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
                            mainResourceName="staticValue"
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
                            onVisibilityChange={this.toggleTooltipVisibility}
                            appointmentMeta={appointmentMeta}
                            onAppointmentMetaChange={this.onAppointmentMetaChange}
                         />

                        <AppointmentForm />

                        <Toolbar />
                        <ViewSwitcher />
                    </Scheduler>
                </Paper>

                <Box
                    sx={{
                        width: "100%",
                        height: 2,
                        backgroundColor: 'rgb(33, 37, 41)',
                    }}
                > </Box>
                <div style={{height: "10px"}} display="block"> </div>
                <Box
                    class="SuggestionBox"
                    style={{
                        width: 300,
                        height: 200,
                        margin: "auto",
                        backgroundColor: 'rgb(33, 37, 41)',
                        padding: 5
                    }}
                >
                    <h6 style={{color:"white"}}> Suggestion </h6>
                    <p style={{color:"white"}}>
                        Employee: [name] <br/>
                        Date: [number] <br/>
                        Start: [time] <br/>
                        End: [time] <br/>
                    </p>
                </Box>
                <div style={{height: "10px"}}> </div>
            </body>
        )
    }
}