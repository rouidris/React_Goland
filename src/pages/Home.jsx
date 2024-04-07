import {Navigate, useNavigate} from "react-router-dom";
import {ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, USER_ROUTE} from "../utils/const.jsx";
import image1 from "../assets/Precision-Agriculture-Systems.jpg"
import image2 from "../assets/img1.jpg"
import image3 from "../assets/img2.jpg"
import image4 from "../assets/img3.jpg"
import React, {useContext, useEffect, useState} from 'react';
import Map from "../map/Map.jsx"
import MapJson from "../map/MapJson.jsx"
import {areamap} from "../http/userApi.jsx";
import {Context} from "../main.jsx";
import login from "./Login.jsx";
import CoordinatesStore from "../mobX/CoordinatesStore.jsx";


const Home = () => {
    const Navigate = useNavigate()
    const [showForm, setShowForm] = useState(false);
    const [area, setArea] = useState('');
    const [droneCategory, setDroneCategory] = useState('');
    const [Category, setCategory] = useState('');
    const [coordinates, setCoor] = useState('');

    const handleOrder = () => {
        setShowForm(true);
        const areaScr = document.getElementById("area_scr");
        const areaValue = areaScr.textContent;
        setArea(areaValue);
        const coorScr = document.getElementById("area_coor");
        const coorValue = coorScr.textContent;
        setCoor(coorValue);
        // const priceScr = document.getElementById("price_scr");
        // const priceValue = priceScr.textContent;
        // setPrice(priceValue);


    };
    console.log("пашет: ", coordinates);
    const handleSubmit = async (event) => {
    };


    const handleCancel = () => {
        setShowForm(false);
    };

    return (

        <div>

            <header id="header" className="header">

                <div className="container">
                    <div className="nav">
                        <ul className="menu">
                            <li>
                                <a href="#">
                                    Главная
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    Услуги компании
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    Дроны
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    Контакты
                                </a>
                            </li>
                        </ul>
                        <a href="tel:+18938392364" className="tel">
                            +1 893 839-23-64
                        </a>

                        <li>

                            <button onClick={() => Navigate(REGISTRATION_ROUTE)}>Регистрация</button>
                            <button onClick={() => Navigate(LOGIN_ROUTE)}>Авторизоваться</button>
                        </li>


                    </div>

                </div>
            </header>

            <section id="about" className="about">
                <div className="container">
                    <div className="offer">
                        <p>Обработка и мониторинг сельскохозяйственных угодий</p>
                        <img src={image1} alt="dron" />

                    </div>
                    <h2>Воспользуйтесь картой для нахождения вашего поля</h2>
                    <div className="description">
                        <Map/>
                    </div>
                    <div className="wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>Площадь</th>
                                <th>Категория</th>
                                <th>Специальный дрон</th>
                                <th>Дата облета</th>
                                <th>Количество точек</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td id="area_scr">
                                    <input type="text" id="area_input" placeholder="Введите площадь в кв. м"/>
                                </td>

                                <td>
                                    <details>
                                        <summary>Выберите категорию</summary>
                                        <select id="category"
                                                value={Category}
                                                onChange={(event) => setCategory(event.target.value)}
                                        >
                                            <option value="Пшеница">Пшеница</option>
                                            <option value="Кукуруза">Кукуруза</option>
                                            <option value="Подсолнечник">Подсолнечник</option>
                                            <option value="Рис">Рис</option>
                                            <option value="Соя">Соя</option>
                                            <option value="Свекла">Свекла</option>
                                            <option value="Картофель">Картофель</option>
                                        </select>
                                    </details>
                                </td>
                                <td>
                                    <details>
                                        <summary>Выберите дрон</summary>
                                        <select
                                            id="drone"
                                            value={droneCategory}
                                            onChange={(event) => setDroneCategory(event.target.value)}
                                        >
                                            <option value="">Выберите категорию</option>
                                            <option value="Квадрокоптер">Квадрокоптер</option>
                                            <option value="Мультиротор">Мультиротор</option>
                                            <option value="Фиксированное крыло">Фиксированное крыло</option>
                                        </select>
                                    </details>

                                </td>
                                <td>
                                    <details>
                                        <summary>Выберите дату</summary>
                                        <input type="date" id="date"/>
                                    </details>
                                </td>
                                <td id="area_coor"></td>
                            </tr>

                            </tbody>
                        </table>



                        {showForm ? (
                            <form onSubmit={handleSubmit} className="my-form">
                                <label>
                                    <p>Площадь: {area}</p>
                                </label>
                                <label>
                                    <p>Категория поля: {Category}</p>
                                </label>
                                <label>
                                    <p>Категория дрона: {droneCategory}</p>
                                </label>
                                <label>
                                    <p>Точки: {coordinates}</p>
                                </label>
                                <button type="submit" className="submit">
                                    Оплатить
                                </button>
                                <button className="button" onClick={handleCancel}>
                                    Отменить
                                </button>
                            </form>


                        ) : (
                            <button className="zakaz" onClick={handleOrder}>
                        Заказать!
                    </button>
                    )}
                    </div>
                    <div className="gallery">
                        <img src={image2} alt="dron" />
                        <img src={image3} alt="dron" />
                        <img src={image4} alt="dron" />

                    </div>
                </div>
            </section>
            <footer id="footer" className="footer">
                <div className="container">
                    <div className="footer-text">
                        <p>
                            ©2023-2023 dron project
                        </p>
                        <p>
                            SU & Seidakhmetov
                        </p>
                    </div>
                </div>
            </footer>

        </div>

    );
};

export default Home;