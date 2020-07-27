import React from 'react';
import ArticleCard from './ArticleCard';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            isLoading: true,
            loadingError: null,
        }
    }

    componentDidMount() {
        fetch("api/articles")
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

    render() {
        if (this.state.isLoading) return <h1>Loading...</h1>;
        if (this.state.loadingError) return <h1>Error...</h1>;

        const articles = this.state.articles.map(
            article =>
                <div key={article._id} className="col-12 col-lg-6 mb-3">
                    <ArticleCard article={article} maxArticleTextLength={300} />
                </div>
        );

        return (
            <main>
                <h1>Блог обо всем на свете</h1>
                <div className="row">
                    {articles}
                </div>
            </main>
        );
    }
};

export default MainPage;