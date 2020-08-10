import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import MainNavigation from './MainNavigation'
import MainPage from "./MainPage";
import ArticlesEditor from "./ArticlesEditor";
import ArticleDetails from "./ArticleDetails";
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import auth from './Auth';

class App extends React.Component {
    render() {
        return (
            <Router>
                <MainNavigation />
                <Switch>
                    <Route exact path="/" children={<MainPage />} />
                    <Route path="/article/:id" component={ArticleDetails} />
                    <Route path="/editor" component={auth(ArticlesEditor)} />
                    <Route path="/login" component={LoginForm} />
                    <Route path="/registration" component={RegistrationForm} />
                </Switch>
            </Router>
        );
    }
};

export default App;