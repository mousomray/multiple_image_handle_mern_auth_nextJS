import { toast } from "react-toastify"
import axiosInstance from "../api/api"
import { myendpoints } from "../api/endpoints"

export const addproduct = async (data) => {
    try {
        const apiurl = myendpoints[2]
        const response = await axiosInstance.post(apiurl, data)
        console.log("Fetching add data...", response);
        toast.success(response?.data?.message)
        return response
    } catch (error) {
        console.log("Error fetching add product data...", error);
        toast.error(error?.response?.data?.message)
    }
}

export const productlist = async () => {
    try {
        const apiurl = myendpoints[3]
        const response = await axiosInstance.get(apiurl)
        console.log("Fetching show product data...", response);
        return response?.data?.products
    } catch (error) {
        console.log("Error fetching show product data...", error);
    }
}

// Single product
export const singleproduct = async (id) => {
    try {
        const apiurl = `${myendpoints[4]}/${id}`
        const response = await axiosInstance.get(apiurl)
        console.log("Fetching Single product  data...", response);
        return response?.data?.product
    } catch (error) {
        console.log("Error Fetching single product...", error);

    }
}

export const updateproduct = async ({ formdata, id }) => {
    try {
        const apiurl = `${myendpoints[5]}/${id}`
        const response = await axiosInstance.put(apiurl, formdata)
        console.log("Fetching Update product  data...", response);
        toast.success(response?.data?.message);
        return response
    } catch (error) {
        console.log("Error Fetching update product...", error);
        toast.error(error?.response?.data?.errors[0]);
    }
}