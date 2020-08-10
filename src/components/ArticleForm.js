import React from 'react';


class ArticleForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingError: null,
            article: {
                headline: "",
                text: "",
            },
        }
        this.articleImage = React.createRef();
    }

    componentDidMount() {
        if (this.props.editMode == 'edit') {
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
        else {
            this.setState({
                isLoading: false,
            })
        }
    }

    handleHeadlineChange = e => {
        const headline = e.target.value;
        this.setState(state => ({
            article: Object.assign({}, state.article, { headline })
        }));
    }

    handleTextChange = e => {
        const text = e.target.value;
        this.setState(state => ({
            article: Object.assign({}, state.article, { text })
        }));
    }

    handleImageChange = e => {
        let fileReader = new FileReader();
        let file = this.articleImage.current.files[0];
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            this.setState(state => ({
                article: Object.assign({}, state.article, {
                    image: fileReader.result
                })
            }));
        };
        fileReader.onerror = () => {
            alert("Error while loading file");
        };
    }

    handleSubmitClicked = () => {
        const articleHeadline = this.state.article.headline;
        if (!articleHeadline || articleHeadline.length >= 100) {
            alert("Headline length >= 100");
            return;
        }
        const articleText = this.state.article.text;
        if (!articleText || articleText.length >= 5000) {
            alert("Text length >= 5000");
            return;
        }

        const creationDate = Date.now();

        const formData = new FormData();
        formData.append("headline", articleHeadline);
        formData.append("text", articleText);
        formData.append("date", creationDate);
        const articleImage = this.articleImage.current.files[0];
        if (articleImage) {
            const articleImageFileName = articleImage.name;
            formData.append("image", articleImage, articleImageFileName);
        }
        if (this.props.editMode == 'edit') formData.append("id", this.props.match.params.id);

        const fetchMethod = this.props.editMode == "edit" ? "PUT" : "POST";
        fetch(
            "/api/articles",
            {
                method: fetchMethod,
                body: formData
            })
            .then(_ => {
                this.props.history.push('/editor');
            })
            .catch(error => alert(error));
    }

    handleResetClicked = () => {
        this.setState({
            article: {
                headline: "",
                text: "",
            }
        });
        this.articleImage.current.value = "";
    }

    render() {
        if (this.state.isLoading) return <h1>Loading...</h1>;
        if (this.state.loadingError) return <h1>Error...</h1>;

        const articleImage = this.state.article.image
            ? <img src={this.state.article.image} className="img-fluid" />
            : null;

        return (
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-8 mb-3">
                    <form>
                        <div className="form-group">
                            <label>Заголовок:</label>
                            <input
                                type="text"
                                onChange={this.handleHeadlineChange}
                                value={this.state.article.headline}
                                className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Текст статьи:</label>
                            <textarea
                                onChange={this.handleTextChange}
                                value={this.state.article.text}
                                rows="10"
                                className="form-control" />
                        </div>
                        <div className="form-group">
                            <div>
                                <label>Изображение:</label>
                            </div>
                            <input
                                ref={this.articleImage}
                                onChange={this.handleImageChange}
                                type="file"
                                accept=".png, .jpeg, .jpg" />
                        </div>
                        {articleImage}
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={this.handleSubmitClicked}
                                className="btn btn-primary">
                                Сохранить
                        </button>
                            <button
                                type="button"
                                onClick={this.handleResetClicked}
                                className="btn btn-primary ml-2">
                                Очистить
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default ArticleForm;