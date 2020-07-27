import React from 'react';
import EditorArticlesListRow from './EditorArticlesListRow';
import { Link } from 'react-router-dom';

class EditorArticlesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            checkedArticles: [],
            isLoading: true,
            loadingError: null,
        }
    }

    componentDidMount() {
        fetch("/api/articles")
            .then(response => response.json())
            .then(loaded_articles => this.setState({
                articles: loaded_articles,
                isLoading: false
            }))
            .catch(error => this.setState({
                loadingError: error,
                isLoading: false
            }));
    }

    handleCheckArticle = (id, checked) => {
        if (checked) {
            this.setState(state => ({
                checkedArticles: [...state.checkedArticles, id]
            }));
        }
        else {
            this.setState(state => ({
                checkedArticles: state.checkedArticles.filter(articleID => articleID !== id)
            }));
        }
    }

    handleDeleteArticlesClicked = () => {
        for (const id of this.state.checkedArticles) {
            fetch(
                `/api/articles/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(response => response.json())
                .then(article =>
                    this.setState(state => ({
                        articles: state.articles.filter(eachArticle =>
                            eachArticle._id !== article._id)
                    })))
                .catch(error => console.log(error));
        }
    }

    render() {
        if (this.state.isLoading) return <h1>Loading...</h1>;
        if (this.state.loadingError) return <h1>Error...</h1>;

        const articles = this.state.articles.map(
            article => <EditorArticlesListRow
                key={article._id}
                article={article}
                onCheckBoxClicked={this.handleCheckArticle} />);

        return (
            <div>
                <div className="row justify-content-end mb-2">
                    <Link to="/editor/add/" className="btn btn-primary float-righ mr-2">
                        Добавить статью
                    </Link>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={this.handleDeleteArticlesClicked}>
                        Удалить
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Заголовок</th>
                                <th>Дата создания</th>
                                <th>ID</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};

export default EditorArticlesList;