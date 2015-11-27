import { Component } from 'react'
import authStore from '../stores/auth-store'

export default class ProfileForm extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            auth : authStore.getState()
        }
        this.saveProfile = this.saveProfile.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.deleteAccount = this.deleteAccount.bind(this)
    }

    saveProfile(e) {
        e.preventDefault()
    }

    changePassword(e) {
        e.preventDefault()
    }

    deleteAccount(e) {
        e.preventDefault()
    }

    render() {
        let user = this.state.auth.currentUser
        return (
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation" className="active">
                        <a href="#tab-account" aria-controls="home" role="tab" data-toggle="tab">Edit My Account</a>
                    </li>
                    <li role="presentation">
                        <a href="#tab-pass" aria-controls="profile" role="tab" data-toggle="tab">Change Password</a>
                    </li>
                    {/*
                    <li role="presentation">
                        <a href="#tab-settings" aria-controls="messages" role="tab" data-toggle="tab">My Preferences</a>
                    </li>
                    */}
                    <li role="presentation">
                        <a href="#tab-delete" aria-controls="settings" role="tab" data-toggle="tab">
                            <span className="text-danger">Destroy Account</span>
                        </a>
                    </li>
                </ul>
                <br/>
                <div className="tab-content">
                    <div role="tabpanel" className="tab-pane active" id="tab-account">
                        <form className="panel-body form-horizontal" onSubmit={ this.saveProfile }>

                            {/* ---------------- name ------------------ */}
                            <div className="form-group">
                                <label htmlFor="input-name" className="col-xs-4 control-label">Full Name</label>
                                <div className="col-xs-6">
                                    <input id="input-name" className="form-control" type="text" name="name" defaultValue={ user.name }/>
                                </div>
                            </div>

                            {/* ---------------- email ------------------ */}
                            <div className="form-group">
                                <label htmlFor="input-email" className="col-xs-4 control-label">E-mail</label>
                                <div className="col-xs-6">
                                    <input id="input-email" className="form-control" type="email" name="email" defaultValue={ user.email }/>
                                </div>
                            </div>

                            {/* ---------------- username ------------------ */}
                            <div className="form-group">
                                <label htmlFor="input-username" className="col-xs-4 control-label">Username</label>
                                <div className="col-xs-6">
                                    <input id="input-username" className="form-control" type="text" name="username" defaultValue={ user.username }/>
                                </div>
                            </div>

                            <hr/>
                            <div className="form-group">
                                <div className="col-xs-4 col-xs-offset-4">
                                    <button type="submit" className="btn btn-block btn-success">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div role="tabpanel" className="tab-pane" id="tab-pass">
                        <form className="panel-body form-horizontal" onSubmit={ this.changePassword }>

                            {/* ---------------- old_pass ------------------ */}
                            <div className="form-group">
                                <label htmlFor="input-name" className="col-xs-4 control-label">Current Password</label>
                                <div className="col-xs-6">
                                    <input id="input-name" className="form-control" type="password" name="old_pass" />
                                </div>
                            </div>

                            {/* ---------------- new_pass ------------------ */}
                            <div className="form-group">
                                <label htmlFor="input-email" className="col-xs-4 control-label">New Password</label>
                                <div className="col-xs-6">
                                    <input id="input-email" className="form-control" type="password" name="new_pass"/>
                                </div>
                            </div>

                            {/* ---------------- new_pass_2 ------------------ */}
                            <div className="form-group">
                                <label htmlFor="input-email" className="col-xs-4 control-label">New Password Again</label>
                                <div className="col-xs-6">
                                    <input id="input-email" className="form-control" type="password" name="new_pass_2"/>
                                </div>
                            </div>

                            <hr/>
                            <div className="form-group">
                                <div className="col-xs-4 col-xs-offset-4">
                                    <button type="submit" className="btn btn-block btn-warning">Change Password</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div role="tabpanel" className="tab-pane" id="tab-settings">TODO...</div>
                    <div role="tabpanel" className="tab-pane" id="tab-delete">
                        <div className="panel panel-danger text-center">
                            <div className="panel-body">
                                <div style={{ fontSize: 30}}>Please Confirm!</div>
                                <hr/>
                                <div className="text-leftxxxxxx">
                                    <b>Why? We will delete your data... etc</b>
                                </div>
                                <hr/>
                                <div>
                                    <button type="submit" className="btn btn-lg btn-danger" onClick={this.deleteAccount}>Delete My Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
