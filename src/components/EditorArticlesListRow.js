import React from "react";
import { Link } from 'react-router-dom';

class EditorArticlesListRow extends React.Component {
    constructor(props) {
        super(props);
    }

    handleCheckBoxClicked = (event) => {
        this.props.onCheckBoxClicked(this.props.article._id, event.target.checked);
    }

    render() {
        return (
            <tr>
                <td>
                    <Link to={`/editor/edit/${this.props.article._id}`}>
                        {this.props.article.headline}
                    </Link>
                </td>
                <td>{new Date(this.props.article.date).toLocaleString("ru")}</td>
                <td>{this.props.article._id}</td>
                <td>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onClick={this.handleCheckBoxClicked} />
                </td>
            </tr>
        )
    }
};

export default EditorArticlesListRow;
