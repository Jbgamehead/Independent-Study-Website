import { styled, alpha } from "@mui/material/styles";

const classes = {
    title: "Title",
    textContainer: "TextContainer",
    time: "Time",
    text: "Text",
    container: "AppointmentContainer"
}


function template(appointments) {
    const StyledAppointmentsAppointmentContent = styled(
      "Appointments.AppointmentContent"
    )(() => ({
      [`& .${classes.title}`]: {
        fontWeight: "bold",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      [`& .${classes.textContainer}`]: {
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
        width: "100%"
      }
    }));

    const AppointmentContent = ({ data, formatDate, ...restProps }) => (
      <StyledAppointmentsAppointmentContent
        {...restProps}
        formatDate={formatDate}
        data={data}
      >
        <div className="container">
          <div className="title">{data.title}</div>
            <div className={classes.textContainer}>

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

    return AppointmentContent
}

export default {
    template
}