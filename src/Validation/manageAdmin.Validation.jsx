import * as Yup from "yup";


export const ManageAdminSchema = Yup.object({
    name: Yup.string().required("Enter Event Name"),
    role: Yup.string(),
    contact: Yup.string().required("Enter Event Date"),
    email: Yup.string().required("Enter email "),
    address: Yup.string().required("Enter Address "),
})


// eslint-disable-next-line react-refresh/only-export-components
export const ManageAdminInitValue = {
    name: "",
    role: "admin",
    email: "",
    eventSummary: "",
    address:""
}