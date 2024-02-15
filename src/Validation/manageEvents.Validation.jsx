import * as Yup from "yup";


export const ManageEventsSchema = Yup.object({
    eventName: Yup.string().required("Enter Event Name"),
    eventLocation: Yup.string().required("Enter Event Location"),
    eventDate: Yup.string().required("Enter Event Date"),
    hostName:Yup.string().required("Enter host name"),
    hostEmail:Yup.string().required("Enter host email"),
    hostWhatsappNumber:Yup.string().required("Enter whatsapp number"),
    assignPhotographer:Yup.string().required("Select photographer"),
      other: Yup.string().when('eventCategory', (value) => {
          if (value == 'Others') {
              return Yup.string().required("Enter other event")
          } else {
              return Yup.string()
          }
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
    assignPhotographer:"",
    other:""
}

export const ManageAssignPhotographers = {
    photographerId:"",
    eventId:""
}