import {$host} from './index.jsx'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'

export const login = async (username, email, password) => {
    const {data} = await $host.post('/auth/login', {username, email, password})
    //установка active на бд
    Cookies.set("token", data.token, {secure: false, httpOnly: true});
    return jwt_decode(data.token)
}
export const areamap = async (coordinates) => {
    const { data } = await $host.post('/user/map', { coordinates });
    return data;
};


export const registration = async (username, email, password) => {
    const {data} = await $host.post('/auth/registration', {username, email, password, Roles: "USER"})
    Cookies.set("token", data.token, {secure: false, httpOnly: true});
    return jwt_decode(data.token)
}

export const fetchUserInfo = async (id) => {
    let data;
    ({data} = await $host.get('/user/' + id));
    return data
}
export const fetchProject = async (ProjectId) => {
    try {
        const response = await $host.get('/project', { params: { ProjectId } });
        if (response && response.data && response.data.project && response.data.project.coordinates) {
            return response.data.project.coordinates;
        } else {
            throw new Error('Некорректный ответ сервера');
        }
    } catch (error) {
        throw error;
    }
};
