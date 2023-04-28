// import { styled, alpha } from "@mui/material/styles";
//
//
// const StyledAppointmentsAppointmentContent = styled(
//   Appointments.AppointmentContent
// )(() => ({
//   [`& .${classes.title}`]: {
//     fontWeight: "bold",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap"
//   },
//   [`& .${classes.textContainer}`]: {
//     lineHeight: 1,
//     whiteSpace: "pre-wrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     width: "100%"
//   },
//   [`& .${classes.time}`]: {
//     display: "inline-block",
//     overflow: "hidden",
//     textOverflow: "ellipsis"
//   },
//   [`& .${classes.text}`]: {
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap"
//   },
//   [`& .${classes.container}`]: {
//     width: "100%"
//   }
// }));
//
// const AppointmentContent = ({ data, formatDate, ...restProps }) => (
//   <StyledAppointmentsAppointmentContent
//     {...restProps}
//     formatDate={formatDate}
//     data={data}
//   >
//     <div className={classes.container}>
//       <div className={classes.title}>{data.title}</div>
//     </div>
//   </StyledAppointmentsAppointmentContent>
// );
//
// export default {
//     AppointmentContent
// }