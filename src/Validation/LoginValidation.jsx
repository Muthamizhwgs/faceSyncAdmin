import * as Yup from "yup";

export const LoginSchema =  Yup.object({
    userName:Yup.string().required("Enter User Name "),
    password:Yup.string().required("Enter Valid Password "),
})

export const LoginInitValue = {
    userName:'',
    password:''
}