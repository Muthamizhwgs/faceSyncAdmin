import * as Yup from "yup";

export const ChangePasswordSchema = Yup.object({
    oldPassword: Yup.string().required("Enter the old password"),
    newPassword: Yup.string().required("Enter valid password "),
    confirmPassword: Yup.string()
        .required('Enter a valid password')
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')

})

export const ChangePasswordInitValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
}