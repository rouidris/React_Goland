// OrderForm.jsx
import React, { useState } from 'react';
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

const OrderForm = ({ showForm, handleOrder, handleCancel, area, Category, droneCategory, coordinates }) => {
    return (
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

    );
};

export default OrderForm;
