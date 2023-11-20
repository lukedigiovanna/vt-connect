import axios from "axios";

const url = "http://127.0.0.1:5000/api";

export const apiGet = async (path: string) => {
    return axios.get(`${url}${path}`);
};

export const apiPost = async (path: string, body: any = {}) => {
    return axios.post(`${url}${path}`, {
        ...body
    });
};

export const apiDelete = async (path: string, body: any = {}) => {
    return axios.delete(`${url}${path}`, {
        ...body
    })
};

export const apiPut = async (path: string, body: any = {}) => {
    return axios.put(`${url}${path}`, {
        ...body
    })
};
