import React from 'react';

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            displayName: '',
        }
    }

    handleLoginChange = e => {
        this.setState({ login: e.target.value });
    }

    handlePasswordChange = e => {
        this.setState({ password: e.target.value });
    }

    handleDisplayNameChange = e => {
        this.setState({ displayName: e.target.value });
    }

    handleRegistrationClicked = () => {
        const user = {
            login: this.state.login,
            password: this.state.password,
            displayName: this.state.displayName
        };

        fetch("/api/register", {
            method: "POST",
            body: JSON.stringify(user),
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

    render() {
        return (
            <div className="row justify-content-center">
                <div className="col-8 col-sm-6 col-lg-4 col-xl-3">
                    <form className="border rounded p-3">
                        <div className="form-group">
                            <label>
                                Логин:
                            <input
                                    type="text"
                                    value={this.state.login}
                                    onChange={this.handleLoginChange}
                                    className="form-control" />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Пароль:
                                <input
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                    className="form-control" />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Имя:
                                <input
                                    type="text"
                                    value={this.state.displayName}
                                    onChange={this.handleDisplayNameChange}
                                    className="form-control" />
                            </label>
                        </div>
                        <div className="form-group text-center">
                            <button
                                type="button"
                                onClick={this.handleRegistrationClicked}
                                className="btn btn-primary">
                                Регистрация
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default RegistrationForm;