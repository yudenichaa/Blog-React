import React from 'react';
import { Redirect } from 'react-router-dom';

export default function auth(ComponentToProtect) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                redirect: false
            };
        }

        componentDidMount() {
            fetch("/api/authenticate")
                .then(res => {
                    if (res.status == 200) {
                        this.setState({
                            loading: false
                        });
                    }
                    else {
                        res.json()
                            .then(data => {
                                console.log(data.error);
                                this.setState({
                                    loading: false,
                                    redirect: true
                                });
                            })
                    }
                })
        }

        render() {
            const { loading, redirect } = this.state;
            if (loading) return null;
            if (redirect) {
                return <Redirect push to="/login" />
            }
            return <ComponentToProtect {...this.props} />
        }
    }
}