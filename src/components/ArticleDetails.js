import React from 'react';

class ArticleDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            article: {},
            isLoading: true,
            loadingError: null,
        }
    }

    componentDidMount() {
        fetch("/api/article/" + this.props.match.params.id)
            .then(response => response.json())
            .then(loaded_article => this.setState({
                article: loaded_article,
                isLoading: false,
            }))
            .catch(error => this.setState({
                loadingError: error,
                isLoading: false
            }));
    }

    render() {
        if (this.state.isLoading) return <h1>Loading...</h1>;
        if (this.state.loadingError) return <h1>Error...</h1>;

        return (
            <article>
                <h1>{this.state.article.headline}</h1>
                <p className="text-muted">{new Date(this.state.article.date).toLocaleString("ru")}</p>
                <img src={this.state.article.image}
                className="img-fluid mx-auto d-block"/>
                <p className="mt-3">{this.state.article.text}</p>
            </article>
        )
    }
}

export default ArticleDetails;