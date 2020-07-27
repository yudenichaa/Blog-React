import React from 'react';
import { Redirect } from 'react-router-dom';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            toRegistration: false
        }
    }

    handleLoginInput = e => { this.setState({ login: e.target.value }); }

    handlePasswordInput = e => { this.setState({ password: e.target.value }); }

    handleLoginClicked = () => {
        const loginInformation = {
            login: this.state.login,
            password: this.state.password
        };
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(loginInformation),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (res.status == 200) {
                    this.props.history.goBack();
                }
                else {
                    res.json()
                        .then(data => alert(data.error));
                }
            })
            .catch(_ => {
                alert("Internal error, try again later.");
            });
    }

    handleRegistrationClicked = () => {
        this.setState({
            toRegistration: true,
        });
    }

    render() {
        if (this.state.toRegistration) return <Redirect to="/registration" />
        else return (
            <div className="row justify-content-center">
                <div className="col-8 col-sm-6 col-lg-4 col-xl-3">
                    <form className="border rounded p-3">
                        <div className="form-group">
                            <label>Логин:</label>
                            <input
                                onChange={this.handleLoginInput}
                                type="text"
                                value={this.state.login}
                                className="form-control"
                                
                            />
                        </div>
                        <div className="form-group">
                            <label>Пароль:</label>
                            <input
                                onChange={this.handlePasswordInput}
                                value={this.state.password}
                                type="password"
                                className="form-control"
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary mr-2"
                            onClick={this.handleLoginClicked}>
                            Войти
                        </button>
                        <button
                            onClick={this.handleRegistrationClicked}
                            type="button"
                            className="btn btn-primary">
                            Регистрация
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default LoginForm;