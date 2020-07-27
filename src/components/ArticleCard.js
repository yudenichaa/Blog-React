import React from 'react';
import { Link } from 'react-router-dom';

class ArticleCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const articleText = this.props.article.text.length > this.props.maxArticleTextLength
            ? this.props.article.text.slice(0, this.props.maxArticleTextLength) + "..."
            : this.props.article.text;
        return (
            <div className="card">
                <img className="card-img-top"
                    src={this.props.article.image} />
                <div className="card-body">
                    <h2 className="card-title">
                        <Link to={`/article/${this.props.article._id}`}>
                            {this.props.article.headline}
                        </Link>
                    </h2>
                    <p className="card-subtitle text-muted mb-2">
                        {new Date(this.props.article.date).toLocaleString("ru")}
                    </p>
                    <p className="card-text">
                        {articleText}
                    </p>
                </div>
            </div >
        );
    }
};

export default ArticleCard;