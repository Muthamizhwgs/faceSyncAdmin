import * as Yup from "yup";


export const ManagephotographerSchema = Yup.object({
    userName: Yup.string().required("Enter Event Name"),
    contact: Yup.string().required("Enter Event Location"),
    email: Yup.string().required("Enter email"),
    role: Yup.string()

})


export const PhotographerInitValue = {
    userName:'',
    contact:'',
    email:'',
    role:'photographer'
}