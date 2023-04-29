import { styled, alpha } from "@mui/material/styles";

import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

const classes = {
    title: "Title",
    textContainer: "TextContainer",
    time: "Time",
    text: "Text",
    container: "MiniContainer"
}


function template(
    appointments,
    roomMapper, employeeMapper, colorGetter,
    setState,
    toggleTooltipVisibility, onAppointmentMetaChange,
    submitSuggestion
) {
    const StyledAppointmentsAppointmentContent = styled(
      Appointments.AppointmentContent
    )(() => ({
      [`& .${classes.title}`]: {
        fontWeight: "bold",
        color: "white",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      [`& .${classes.textContainer}`]: {
        color: "white",
        backgroundColor: "rgb(33, 37, 41)",
        padding: "2px",
        borderRadius: "3px",
        lineHeight: 1,
        whiteSpace: "pre-wrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%"
      },
      [`& .${classes.time}`]: {
        display: "inline-block",
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      [`& .${classes.text}`]: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      [`& .${classes.container}`]: {
        width: "100%",
        padding: "0px",
        paddingLeft: "0px"
      }
    }));

    const AppointmentContent = ({ data, formatDate, ...restProps }) => {
        var string = colorGetter(data.members[0])
        const color = { backgroundColor: string, height: "100%", padding: "0px" }

        var title = data.title
        var inf = <div/>
        var body = <div className={classes.textContainer}>
                       <div className={classes.text}>{roomMapper(data.roomId)}</div>

                       <div className={classes.time}>
                           {formatDate(data.startDate, { hour: "numeric", minute: "numeric" })}
                       </div>
                       <div className={classes.time}>{" - "}</div>
                       <div className={classes.time}>
                           {formatDate(data.endDate, { hour: "numeric", minute: "numeric" })}
                       </div>
                   </div>
        if (data.isGhost) {
            body = <div/>
            inf = (
            <div>
                <div
                    style={{
                        position: "absolute",
                        bottom: 4,
                        left: 4,
                        backgroundColor: "green",
                        width: "10px",
                        height: "10px",
                    }}

                    onClick = {function(e) {
                        console.log("pressed")
                        submitSuggestion(data, data.slot)
                    }}
                >
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: 4,
                        left: 16,
                        backgroundColor: "red",
                        width: "10px",
                        height: "10px",
                    }}

                    onClick = {function(e) {
                        console.log("pressed")
                        submitSuggestion(data, data.slot, true)
                    }}
                >
                </div>

                {data.members.map((id, index) => {
                    return <p> {employeeMapper(id)} </p>
                })}
            </div>
            )
        }

        return (
            <StyledAppointmentsAppointmentContent
                {...restProps}
                formatDate={formatDate}
                data={data}

                style={color}

                onClick={function(e) {
                    onAppointmentMetaChange({data, target: e.target.value})
                }}
            >
                <div display="box" style={{paddingLeft: 5, paddingBottom: 5, paddingRight: 5}}>
                    <div className={classes.title}> {title} </div>
                    {inf}

                    {body}
                </div>
            </StyledAppointmentsAppointmentContent>
        );
    }

    return AppointmentContent
}

export default {
    template
}