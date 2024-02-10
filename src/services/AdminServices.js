import useAxiosInterceptors from "../interceptors/axios";


export const Login = async (data) => {
    let ApiResponse = await useAxiosInterceptors.post("admin/login", data);
    return ApiResponse;
};
