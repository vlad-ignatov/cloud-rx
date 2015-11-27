import { Component } from 'react'
import authActions   from '../actions/auth-actions'
import authStore     from '../stores/auth-store'

export default class RegistrationForm extends Component
{
    constructor(...args) {
        super(...args)
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
        authActions.register({
            name     : $.trim(this.refs.name     .value),
            email    : $.trim(this.refs.email    .value),
            username : $.trim(this.refs.username .value),
            password : $.trim(this.refs.password .value),
            password2: $.trim(this.refs.password2.value)
        })
    }

    render() {

        return (
            <form className="panel-body form-horizontal" onSubmit={ this.onSubmit }>

                <div className="page-header">
                    <div className="row">
                        <h2 className="col-xs-12 col-sm-8 col-sm-offset-4">
                            Register at CloudRX
                        </h2>
                    </div>
                </div>

                {/* validation error ---------------------------------------- */}
                { this.state.validationError ? (
                    <div className="alert alert-danger">
                        <button type="button" className="close" data-dismiss="alert"
                            aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        { this.state.validationError }
                    </div>
                ) : ''}

                {/* ---------------- name --------------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">Full Name</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="text" name="fullname" ref="name"/>
                        <span className="help-block text-muted">
                            A block of help text that breaks onto a new line and may extend beyond one line.
                            A block of help text that breaks onto a new line and may extend beyond one line.
                        </span>
                    </div>
                </div>

                {/* ---------------- email -------------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">E-mail</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="email" name="email" ref="email"/>
                        <span className="help-block text-muted">
                            A block of help text that breaks onto a new line and may extend beyond one line.
                            A block of help text that breaks onto a new line and may extend beyond one line.
                        </span>
                    </div>
                </div>

                {/* ---------------- username ----------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">Username</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="text" name="username" ref="username" autoComplete={ false }/>
                        <span className="help-block text-muted">
                            A block of help text that breaks onto a new line and may extend beyond one line.
                            A block of help text that breaks onto a new line and may extend beyond one line.
                        </span>
                    </div>
                </div>

                {/* ---------------- password ----------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">Password</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="password" name="password" ref="password" autoComplete={ false }/>
                        <span className="help-block text-muted">
                            A block of help text that breaks onto a new line and may extend beyond one line.
                            A block of help text that breaks onto a new line and may extend beyond one line.
                        </span>
                    </div>
                </div>

                {/* ---------------- password2 ---------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">Repeat Password</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="password" name="password2" ref="password2" autoComplete={ false }/>
                        <span className="help-block text-muted">
                            A block of help text that breaks onto a new line and may extend beyond one line.
                            A block of help text that breaks onto a new line and may extend beyond one line.
                        </span>
                    </div>
                </div>

                <hr/>

                {/* ---------------- Submit ------------------------- */}
                <div className="form-group">
                    <div className="col-xs-8 col-sm-4 col-md-3 col-sm-offset-4 col-xs-offset-2">
                        <button type="submit" className="btn btn-block btn-success">Register</button>
                    </div>
                </div>
            </form>
        );
    }
}
