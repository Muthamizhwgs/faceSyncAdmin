import * as Yup from "yup";


export const ManageEventsSchema = Yup.object({
    eventName: Yup.string().required("Enter Event Name"),
    eventLocation: Yup.string().required("Enter Event Location"),
    eventDate: Yup.string().required("Enter Event Date"),
    hostName:Yup.string().required("Enter host name"),
    hostEmail:Yup.string().required("Enter host email"),
    hostWhatsappNumber:Yup.string().required("Enter whatsapp number"),
    other: Yup.string().when('eventCategory', {
        is: (value) => value === '5', // '5' corresponds to the value of "Others"
        then: Yup.string().required("Enter Other Event"),
        otherwise: Yup.string().notRequired(),
      }),
})

export const ManageEventsSchema2 = Yup.object({
    photographerId: Yup.string().required("Enter the Name"), 
    eventId: Yup.string()
})


// eslint-disable-next-line react-refresh/only-export-components
export const ManageEventsInitValue = {
    eventName: "",
    eventLocation: "",
    eventDate: "",
    eventCategory:"",
    hostName:"",
    hostEmail:"",
    hostWhatsappNumber:"",
    other:""
}

export const ManageAssignPhotographers = {
    photographerId:"",
    eventId:""
}