import React, {useContext, useState} from 'react';
import './style.css';
import {ADMIN_ROUTE, HOME_ROUTE, USER_ROUTE} from "../utils/const.jsx";
import {useNavigate} from "react-router-dom";
import {registration} from "../http/userApi.jsx";
import {Context} from "../main.jsx";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
function RegistrationForm() {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const click = async () => {
        try {
            let data

            data = await registration(username, email, password)
            user.setUser(data)
            user.setIsAuth(true)
            console.log(data)
            console.log(username, email, password)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Form className="form-login">
            <Form.Group controlId="username">
                <Form.Label className="my-label">Username</Form.Label>
                <Form.Control
                    className="my-input"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label className="my-label">Email address</Form.Label>
                <Form.Control
                    className="my-input"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label className="my-label">Password</Form.Label>
                <Form.Control
                    className="my-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={click}>
                Зарегистрироваться
            </Button>
        </Form>
    );
}
export default RegistrationForm;