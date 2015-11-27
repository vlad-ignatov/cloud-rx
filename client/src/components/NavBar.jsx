import { Component } from 'react'
import authActions   from '../actions/auth-actions'
import authStore     from '../stores/auth-store'

let { Link } = ReactRouter

export default class NavBar extends Component
{
    constructor() {
        super()
        this.state = {
            authState: authStore.getState()
        }
        this.onAuthChange = this.onAuthChange.bind(this)
    }

    componentDidMount() {
        authStore.listen(this.onAuthChange);
    }

    componentWillUnmount() {
        authStore.unlisten(this.onAuthChange);
    }

    onAuthChange() {
        this.setState({ authState: authStore.getState() })
    }

    render() {
        let currentUser = this.state.authState.currentUser
        return (
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button"
                                className="navbar-toggle collapsed"
                                data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1"
                                aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link to="/" className="navbar-brand" style={{
                                background: 'url(/img/cloud.png) 65px 4px no-repeat',
                                backgroundSize:38,
                                padding:'0 20px',
                                lineHeight:'50px',
                                color:'#157EFB'
                            }}>
                            Cloud
                            <span style={{ color:'#fff', paddingLeft:6 }}>Rx</span>
                        </Link>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                        {/* left nav -----------------------------------------*/}
                        {currentUser && currentUser.username ? (
                        <ul className="nav navbar-nav">
                            <li className={ this.props.location.pathname.indexOf('/cabinet') === 0 ? 'active' : ''}>
                                <Link to="cabinet">
                                    <i className="glyphicon glyphicon-briefcase"></i>
                                    &nbsp;Medication Cabinet
                                    <span className="sr-only">(current)</span>
                                </Link>
                            </li>
                            <li className={ this.props.location.pathname.indexOf('/calendar') === 0 ? 'active' : ''}>
                                <Link to="calendar">
                                    <i className="glyphicon glyphicon-calendar"></i>
                                    &nbsp;Pillbox Calendar
                                </Link>
                            </li>
                        </ul>) : ''}

                        {/* form ---------------------------------------------*/}
                        {currentUser && currentUser.username ? (
                        <form className="navbar-form navbar-left hidden-sm" role="search">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Search"/>
                            </div>
                        </form>) : ''}

                        {/* right-nav ----------------------------------------*/}
                        {currentUser && currentUser.username ? (
                            <ul className="nav navbar-nav navbar-right">
                                {currentUser.role == 'admin' || currentUser.role == 'manager' ? (
                                    <li className="dropdown">
                                        <a href="#"
                                            className="dropdown-toggle"
                                            data-toggle="dropdown"
                                            role="button"
                                            aria-haspopup="true"
                                            aria-expanded="false">
                                                <i className="glyphicon glyphicon-cog"></i>
                                                <span className="caret"></span>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link to="/users">
                                                    <i className="glyphicon glyphicon-user">&nbsp;</i>
                                                    Users
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/logs">
                                                    <i className="glyphicon glyphicon-align-justify">&nbsp;</i>
                                                    Logs
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/stats">
                                                    <i className="glyphicon glyphicon-signal">&nbsp;</i>
                                                    Statistics
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/settings">
                                                    <i className="glyphicon glyphicon-cog">&nbsp;</i>
                                                    Settings
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                ) : ''}
                                <li className="dropdown">
                                    <a href="#"
                                        className="dropdown-toggle"
                                        data-toggle="dropdown"
                                        role="button"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                            <i className="glyphicon glyphicon-user"></i>
                                            &nbsp;{ currentUser.username }
                                            <span className="caret"></span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="/account">
                                                <i className="glyphicon glyphicon-cog">&nbsp;</i>
                                                My Account
                                            </Link>
                                        </li>
                                        <li role="separator" className="divider"></li>
                                        <li>
                                            <a href="#" onClick={ authActions.logout }>
                                                <span className="text-danger">
                                                    <i className="glyphicon glyphicon-log-out">&nbsp;</i>
                                                    Sign out
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        ) : (
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register">Register</Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        );
    }
}
