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
import {indigo} from '@mui/material/colors'

const allColors = [[indigo, "indigo"]]


import Query from './util/Query.jsx'

const today = new Date()
console.log(today)


var lastChanged = {}

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
        this.submitSuggestion = this.submitSuggestion.bind(this)
        this.toggleTooltipVisibility = () => {
            const { tooltipVisible } = this.state
            this.setState({ tooltipVisible: !tooltipVisible });
        }
        this.onAppointmentMetaChange = ({ data, target }) => {
            this.setState({ appointmentMeta: { data, target } })
        }
    }

    submitSuggestion(appointment, slot, rejected) {
        this.commitChanges({ deleted: appointment.id })
        appointment.isGhost = false
        if (!rejected) {
            this.commitChanges({ added: appointment })
            slot.submit()
        }
    }

    commitChanges({ added, changed, deleted }) {
        var collection = filter([added, changed, deleted])
        if (JSON.stringify(lastChanged) === JSON.stringify(collection))
            return
        lastChanged = collection

        if (added != undefined) {
            this.setState((state) => {
                provider.addEvent(added, (member) => {
                    var members = this.state.resources[0].instances
                    for (var i = 0; i < members.length; i++) if (members[i].id == member) return members[i].text
                    return "missing"
                })

                let { data } = state

                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0
                data = [...data, { id: startingAddedId, ...added }]

                return { data }
            })
        }
    }

    render() {
        const { data, resources, grouping, currentViewName, firstRender, tooltipVisible, appointmentMeta } = this.state

        lastChanged = []

        if (this.state.firstRender) {
            this.state.firstRender = false

            /* run setup */
            getLock("people", 1)
            getLock("table", 1)

            /* add employees */
            Query.get('http://localhost:8081/get/1')
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
                            queryEmployee(employees[i].id)

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
            Query.get('http://localhost:8081/calendar/admin/get')
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
            return "missing"
        }, (member) => {
            var members = this.state.resources[0].instances
            for (var i = 0; i < members.length; i++) if (members[i].id == member) return members[i].color[300]
            return indigo[300]
        }, (st) => {this.setState(st)}, this.toggleTooltipVisibility, this.onAppointmentMetaChange, this.submitSuggestion)

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
                            startDayHour={0}
                            endDayHour={24}
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