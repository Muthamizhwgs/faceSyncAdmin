import useAxiosInterceptors from "../interceptors/axios";


export const LoginUsers = async (data) => {
    let ApiResponse = await useAxiosInterceptors.post("admin/login", data);
    return ApiResponse;
};


export const createEvents = async(data)=>{
    let ApiResponse = await useAxiosInterceptors.post("admin/events", data);
    return ApiResponse;
}


export const getEvents = async()=>{
    let ApiResponse = await useAxiosInterceptors.get("admin/get/events");
    return ApiResponse;
}

export const CreatePhotoGrapher = async(data)=>{
    const ApiResponse = await useAxiosInterceptors.post("admin",data);
    return ApiResponse
}

export const getPhotoGrapher = async()=>{
    const ApiResponse = await useAxiosInterceptors.get("admin/get/photogpaher");
    return ApiResponse
}