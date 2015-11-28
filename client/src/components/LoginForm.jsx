import { Component } from 'react'
import authActions   from '../actions/auth-actions'

const { Link } = ReactRouter

export default class LoginForm extends Component
{
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
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
                    <span>This is just a demo prototype so feel free to </span>
                    <Link to="/register">register</Link> and you will
                    <span>immediately be able login and create meds, upload images etc.</span>
                </p>
                <div className="col-sm-4 col-sm-offset-4 col-xs-6 col-xs-offset-3" style={{ marginTop: 40 }}>
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
                                <button type="submit" className="btn btn-block btn-primary">Sign in</button>
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
