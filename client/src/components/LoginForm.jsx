import { Component } from 'react'
import authActions   from '../actions/auth-actions'
import authStore     from '../stores/auth-store'

const { Link } = ReactRouter

export default class LoginForm extends Component
{
    constructor(props) {
        super(props)
        this.state = authStore.getState()
        this.onSubmit = this.onSubmit.bind(this)
        this.onAuthChange = this.onAuthChange.bind(this)
    }

    componentDidMount() {
        authStore.listen(this.onAuthChange);
    }

    componentWillUnmount() {
        authStore.unlisten(this.onAuthChange);
    }

    onAuthChange() {
        this.setState(authStore.getState())
    }

    onSubmit(e) {
        e.preventDefault()
        authActions.login({
            username: e.target.username.value,
            password: e.target.password.value
        })
    }

    render() {
        return (
            <div>
                <p className="text-warning big text-center">
                    <i className="glyphicon glyphicon-info-sign">&nbsp;</i>
                    <span>This is just a demo prototype (proof of concept) so feel free to </span>
                    <Link to="/register">register</Link><span> and you will
                    immediately be able to login and create meds, upload images etc.</span>
                </p>
                { this.state.validationError ? (
                    <div className="alert alert-danger" ref="alert" style={{ maxWidth: 400, margin: '20px auto' }}>
                        <button type="button"
                            className="close"
                            onClick={ authActions.clearValidationError }
                            aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <i className="glyphicon glyphicon-minus-sign">&nbsp;</i>
                        { this.state.validationError }
                    </div>
                ) : ''}
                <div style={{ maxWidth: 400, margin: '20px auto' }}>
                    <div className="panel panel-default">
                        <form className="panel-body" onSubmit={ this.onSubmit }>
                            <div className="form-group">
                                <label htmlFor="input-username">Username</label>
                                <input id="input-username" className="form-control" type="text" name="username"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="input-password">Password</label>
                                <input id="password" className="form-control" type="password" name="password"/>
                            </div>
                            <hr/>
                            <div className="form-group text-center">
                                <button type="submit" className="btn btn-block btn-primary">
                                    { this.state.loading ? 'Checking...' : 'Sign in' }
                                </button>
                            </div>
                        </form>
                        <div className="panel-footer text-center">
                            <Link to="/register">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
