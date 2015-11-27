import alt from '../alt'
import authActions from '../actions/auth-actions'

class AuthStore
{
    constructor() {
        this.currentUser = JSON.parse(sessionStorage.currentUser || '{}')
        this.loading = false
        this.validationError = null
        this.bindListeners({
            onLogin   : authActions.LOGIN,
            onLogout  : authActions.LOGOUT,
            onRegister: authActions.REGISTER
        });
    }

    onRegister(data) {
        this.setState({ loading: true })
        $.ajax({
            method: 'POST',
            url   : '/api/users',
            data  : JSON.stringify(data),
            contentType: 'application/json; charset=utf-8'
        }).then(
            user => {
                this.setState({ validationError: null, loading: false })
                // location.hash = '/login'
                setTimeout(() => location.hash = '/login', 100)
            },
            xhr => {
                console.error(xhr);
                this.setState({
                    validationError: xhr.responseJSON.message || xhr.responseJSON.error,
                    loading: false
                })
            }
        )
    }

    onLogin(credentials) {
        let _username = $.trim((credentials.username || '') + ''),
            _password = $.trim((credentials.password || '') + '')

        if (_username && _password) {
            sessionStorage.removeItem('currentUser')
            this.setState({ loading: true })
            $.ajax({
                method: 'POST',
                url   : '/api/login',
                data  : JSON.stringify({
                    username: _username,
                    password: _password
                }),
                contentType: 'application/json; charset=utf-8'
            }).then(
                data => {
                    this.setState({ currentUser: data, loading: false })
                    sessionStorage.currentUser = JSON.stringify(data)
                    setTimeout(() => location.hash = '/', 100)
                },
                err  => {
                    console.error(err);
                    this.setState({ currentUser: null, loading: false })
                }
            );
        }
    }

    onLogout(currentUser) {
        this.setState({ loading: true })
        $.ajax({
            method: 'GET',
            url   : '/api/logout'
        }).then(
            data => {
                sessionStorage.removeItem('currentUser')
                this.setState({ currentUser: null, loading: false })
                setTimeout(() => location.hash = '/login', 100)
            },
            xhr  => {
                console.error(xhr.responseJSON.message || xhr.responseJSON.error);
                this.setState({ currentUser: null, loading: false })
            }
        );
    }
}

var authStore = alt.createStore(AuthStore, 'AuthStore')
export default authStore
