import React from "react";
import {
    Switch,
    Route
} from "react-router-dom";
import EditorHeadline from "./EditorHeadline";
import EditorArticlesList from './EditorArticlesList';
import ArticleForm from "./ArticleForm";

class ArticlesEditor extends React.Component {
    render() {
        return (
            <div>
                <EditorHeadline />
                <Switch>
                    <Route exact path="/editor">
                        <EditorArticlesList />
                    </Route>
                    <Route path="/editor/add/" render={props => {
                        props.editMode = 'add';
                        return <ArticleForm {...props} />
                    }} />
                    <Route path="/editor/edit/:id" render={props => {
                        props.editMode = 'edit';
                        return <ArticleForm {...props} />
                    }} />
                </Switch>
            </div>
        );
    }
};

export default ArticlesEditor;