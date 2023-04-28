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
    roomMapper, colorGetter,
    setState,
    toggleTooltipVisibility, onAppointmentMetaChange
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
        margin: "0px",
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
        const string = colorGetter(data.members[0])
        const color = { backgroundColor: string, height: "100%", padding: "0px" }

        return (
            <StyledAppointmentsAppointmentContent
                {...restProps}
                formatDate={formatDate}
                data={data}

                toggleVisibility={toggleTooltipVisibility}
                onAppointmentMetaChange={onAppointmentMetaChange}

                style={color}
            >
                <div display="box" style={{paddingLeft: 5, paddingRight: 5}}>
                    <div className={classes.title}> {data.title} </div>

                    <div className={classes.textContainer}>
                        <div className={classes.text}>{roomMapper(data.roomId)}</div>

                        <div className={classes.time}>
                            {formatDate(data.startDate, { hour: "numeric", minute: "numeric" })}
                        </div>
                        <div className={classes.time}>{" - "}</div>
                        <div className={classes.time}>
                            {formatDate(data.endDate, { hour: "numeric", minute: "numeric" })}
                        </div>
                    </div>
                </div>
            </StyledAppointmentsAppointmentContent>
        );
    }

    return AppointmentContent
}

export default {
    template
}