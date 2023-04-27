import * as React from 'react';
import Paper from '@mui/material/Paper'
import {
    ViewState,
    GroupingState,
    IntegratedGrouping,
    IntegratedEditing,
    EditingState,
} from '@devexpress/dx-react-scheduler'
import {
    Scheduler,
    Resources,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    DragDropProvider,
    GroupingPanel,
    WeekView,
    MonthView,
    Toolbar,
    ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui'
import {
    teal,
    indigo,
} from '@mui/material/colors'

import axios from 'axios'

import Utils from './Utils.js'

const today = new Date()
console.log(today)

function requestAppointments() {
    return axios.get('http://localhost:8081/calendar/admin/get')
        .then(res => {
            if (res.data.Status === 'Success') {
                return res.data
            } else {
                // TODO: display error
                console.log(res)
            }
        })
        .catch(err => console.log(err));
}


function sendAppointment(data) {
    return axios.post('http://localhost:8081/calendar/admin/add', data)
        .then(res => {
            if (res.data.Status !== 'Success') {
                // TODO: feedback
                console.log(res)
            }
        })
        .catch(err => console.log(err));
}

console.log("Requesting appointments")
// TODO: load data into the appointments table
var serverData = requestAppointments()


const appointments = [{
    id: 0,
    title: 'Watercolor Landscape',
    members: [ -1 ],
    roomId: 0,
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
}]


const owners = [{
    text: 'Auto',
    id: -1,
    color: indigo,
}, {
    text: 'Arnie Schwartz',
    id: 1,
    color: teal,
}]
// TODO: request employees from database


const locations = [
    { text: 'Mansfield', id: 1 },
    { text: 'Budd Lake', id: 2 },
]
// TODO: probably should put this onto the database


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
                allowMultiple: true,
            }, {
                fieldName: 'roomId',
                title: 'Location',
                instances: locations,
            }],
            grouping: [{
                resourceName: 'members',
            }],
            groupByDate: "Week",
            isGroupByDate: true
        }

        this.commitChanges = this.commitChanges.bind(this)
    }

    commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
            console.log(added)
            let { data } = state
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }]

                var syncData = {
                    name: added.title,
                    start: Utils.toJson(added.startDate),
                    end: Utils.toJson(added.endDate),
                    people: added.members,
                }
                sendAppointment(syncData)
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
        const { data, resources, grouping, currentViewName } = this.state

        return (
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

                    <WeekView
                        startDayHour={9}
                        endDayHour={15}
                        intervalCount={2}
                    />

                    <Appointments />
                    <Resources
                        data={resources}
                        mainResourceName="members"
                    />

                    <IntegratedGrouping />
                    <IntegratedEditing />

                    <AppointmentTooltip showOpenButton showCloseButton />
                    <AppointmentForm />
                    <GroupingPanel />
                    <DragDropProvider />
                </Scheduler>
            </Paper>
        )
    }
}