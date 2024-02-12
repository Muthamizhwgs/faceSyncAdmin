import * as Yup from "yup";


export const ManageEventsSchema = Yup.object({
    eventName: Yup.string().required("Enter Event Name"),
    eventLocation: Yup.string().required("Enter Event Location"),
    eventDate: Yup.string().required("Enter Event Date"),
    eventSummary: Yup.string()
})


// eslint-disable-next-line react-refresh/only-export-components
export const ManageEventsInitValue = {
    eventName: "",
    eventLocation: "",
    eventDate: "",
    eventSummary:""
}