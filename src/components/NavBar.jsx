// Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/const.jsx';

const NavBar = () => {
    const navigate = useNavigate();

    return (
        <header id="header" className="header">
            <div className="container">
                <div className="nav">
                    <ul className="menu">
                        <li>
                            <a href="#">Главная</a>
                        </li>
                        <li>
                            <a href="#">Услуги компании</a>
                        </li>
                        <li>
                            <a href="#">Дроны</a>
                        </li>
                        <li>
                            <a href="#">Контакты</a>
                        </li>
                    </ul>
                    <a href="tel:+18938392364" className="tel">
                        +1 893 839-23-64
                    </a>
                    <li>
                        <button onClick={() => navigate(REGISTRATION_ROUTE)}>Регистрация</button>
                        <button onClick={() => navigate(LOGIN_ROUTE)}>Авторизоваться</button>
                    </li>
                </div>
            </div>
        </header>
    );
};

export default NavBar;
