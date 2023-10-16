import axios from 'axios';

const endpoint = "http://127.0.0.1:5000/api";

export const get = async (path: string) => {
    return axios.get(`${endpoint}${path}`);
}

export const post = async (path: string, body: any={}) => {
    return axios.get(`${endpoint}${path}`, {
        data: {
            ...body
        }
    });
}