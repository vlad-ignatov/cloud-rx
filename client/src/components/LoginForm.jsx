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
            <div className="col-sm-4 col-sm-offset-4 col-xs-6 col-xs-offset-3" style={{ marginTop: 60 }}>
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
        );
    }
}
