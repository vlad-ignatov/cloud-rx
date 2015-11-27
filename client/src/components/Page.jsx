import { Component } from 'react';
import NavBar        from './NavBar';
import authStore     from '../stores/auth-store'

const PUBLIC_PAGES = [
    '/login',
    '/register'
]

export default class Page extends Component
{
    constructor(...args) {
        super(...args)
        this.state = {
            auth: authStore.getState()
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
        this.setState({ auth: authStore.getState() })
    }

    getContents() {
        let user = this.state.auth.currentUser
        if (!user || !user.username) {
            if (PUBLIC_PAGES.indexOf(this.props.location.pathname) == -1) {
                setTimeout(() => location.hash = '/login', 0)
                return (
                    <div className="text-center">
                        <b>Not authorized!</b><br/>
                        Redirecting...
                    </div>
                );
            }
        }

        if (user && user.username && this.props.location.pathname == '/login') {
            setTimeout(() => location.hash = '/', 0)
            return (
                <div className="text-center">
                    <b>Login succsessfull!</b><br/>
                    Redirecting...
                </div>
            );
        }
        return this.props.children
    }

    render() {
        return (
            <div>
                <NavBar location={ this.props.location } />
                <div className="container">
                    { this.getContents() }
                </div>
                <nav className="navbar navbar-default navbar-fixed-bottom">
                    <div className="container">
                        <ul className="nav navbar-nav">
                            <li className="text-center">
                                <a href="http://medapptech.com" target="_blank" className="text-muted">MedAppTech 2015</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}
