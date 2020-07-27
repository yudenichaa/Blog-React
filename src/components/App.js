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
                    <Route exact path="/" component={MainPage} />
                    <Route path="/article/:id" render={props => <ArticleDetails {...props} />} />
                    <Route path="/editor" component={auth(ArticlesEditor)} />
                    <Route path="/login" render={props => <LoginForm {...props} />} />
                    <Route path="/registration" render={props => <RegistrationForm {...props} />} />
                </Switch>
            </Router>
        );
    }
};

export default App;