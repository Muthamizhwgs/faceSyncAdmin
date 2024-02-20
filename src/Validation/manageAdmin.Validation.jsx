import * as Yup from "yup";


export const ManageAdminSchema = Yup.object({
    userName: Yup.string().required("Enter UserName"),
    email: Yup.string().email().required("Enter email"),
    contact: Yup.string().required("enter contact"),
    address: Yup.string(),
    companyName:Yup.string()
})

// eslint-disable-next-line react-refresh/only-export-components
export const ManageAdminInitValue = {
    userName: "",
    role: "admin",
    contact:"",
    email: "",
    address:"",
    companyName:""
}