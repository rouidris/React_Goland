import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../main.jsx";
import {useParams} from "react-router-dom";
import {fetchUserInfo} from "../http/userApi.jsx";
import {HOME_ROUTE, REGISTRATION_ROUTE} from "../utils/const.jsx";
import {Navigate, useNavigate} from "react-router-dom";
import MapJson from "../map/MapJson.jsx"
import Map from "../map/Map.jsx"

const User = () => {
    const [userInfo, setUserInfo] = useState({UserInfo: []})
    const {id} = useParams()
    useEffect(() => {
        fetchUserInfo(id).then((data) => {
            setUserInfo(data.user_info)
            console.log(data.user_info)
        })
    }, [])
    const Navigate = useNavigate()
    console.log(userInfo)
    return (
        <div>
            <h1>Роль                : {userInfo.Roles}</h1>
            <h1>ID аккаунта         : {userInfo.Account_ID}</h1>
            <h1>Имя пользователя    : {userInfo.Username}</h1>
            <h1>Email               : {userInfo.Email}</h1>
            <div className="description">
                <Map/>
            </div>
            <div className="description">
                <MapJson/>
            </div>
            <button onClick={() => Navigate(HOME_ROUTE)}>Домой</button>
        </div>
    );
};
export default User;