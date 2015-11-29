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
        if (this.state.validationError && this.refs.alert) {
            // this.refs.alert.scrollIntoView()

            let currentScroll = $('body').scrollTop(),
                targetScroll  = $(this.refs.alert).offset().top -
                    parseFloat($('body').css('paddingTop'));

            if (currentScroll > targetScroll) {
                $('body').animate({
                    scrollTop: targetScroll
                }, 200);
            }
        }
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
                            <i className="glyphicon glyphicon-user text-muted"/>
                            <span> Register at CloudRX</span>
                        </h2>
                    </div>
                </div>

                {/* validation error ---------------------------------------- */}
                { this.state.validationError ? (
                    <div className="alert alert-danger" ref="alert">
                        <button type="button"
                            className="close"
                            onClick={ authActions.clearValidationError }
                            aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <i className="glyphicon glyphicon-minus-sign">&nbsp;</i>
                        { this.state.validationError }
                    </div>
                ) : ''}

                {/* ---------------- name --------------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">Full Name</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="text" name="fullname" ref="name"/>
                        <span className="help-block text-muted small">
                            Your full name as it will appear on the website.
                        </span>
                    </div>
                </div>

                {/* ---------------- email -------------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">E-mail</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="email" name="email" ref="email"/>
                        <span className="help-block text-muted small">
                            Valid email address is required here. You cannot register
                            with one email multiple times.
                        </span>
                    </div>
                </div>

                {/* ---------------- username ----------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">Username</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="text" name="username" ref="username" autoComplete={ false }/>
                        <span className="help-block text-muted small">
                            Choose an unique username (we will check if it is unique)
                            that is not longer than 20 characters.
                        </span>
                    </div>
                </div>

                {/* ---------------- password ----------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">Password</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="password" name="password" ref="password" autoComplete={ false }/>
                        <span className="help-block text-muted small">
                            Please choose a good password that contains more than
                            just letters.
                        </span>
                    </div>
                </div>

                {/* ---------------- password2 ---------------------- */}
                <div className="form-group">
                    <label className="col-xs-12 col-sm-4 control-label">Repeat Password</label>
                    <div className="col-xs-12 col-sm-8 col-md-6">
                        <input className="form-control" type="password" name="password2" ref="password2" autoComplete={ false }/>
                        <span className="help-block text-muted small">
                            Please retype the password above.
                        </span>
                    </div>
                </div>

                <hr/>

                {/* ---------------- Submit ------------------------- */}
                <div className="form-group">
                    <div className="col-xs-8 col-sm-4 col-md-3 col-sm-offset-4 col-xs-offset-2">
                        <button type="submit" className="btn btn-block btn-success">
                            { this.state.loading ? 'Loading...' : 'Register' }
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}
