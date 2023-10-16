import axios from "axios";

const url = "http://127.0.0.1:5000/api";

export const get = async (path: string) => {
    return axios.get(`${url}${path}`);
};

export const post = async (path: string, body: any = {}) => {
    return axios.post(`${url}${path}`, {
        body
    });
};
