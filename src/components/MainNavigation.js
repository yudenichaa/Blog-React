import React from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/js/dist/collapse";

class MainNavigation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/">
                    <img src="/static/logo.png" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbar"
                    aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbar">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Главная страница
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link" to="/editor">
                                Редактор статей
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link" to="/login">
                                Войти
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default MainNavigation;