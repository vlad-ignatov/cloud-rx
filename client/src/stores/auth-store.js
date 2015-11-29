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
            onRegister: authActions.REGISTER,
            onClearValidationError : authActions.CLEAR_VALIDATION_ERROR
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
                setTimeout(() => {
                    alert('Your registration was successful')
                    location.hash = '/login'
                }, 100)
            },
            xhr => {
                console.error(xhr);
                this.setState({
                    validationError: xhr.responseJSON.message || xhr.responseJSON.error || 'Unknown error',
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
                    this.setState({
                        currentUser: data,
                        loading: false,
                        validationError: null
                    })
                    sessionStorage.currentUser = JSON.stringify(data)
                    setTimeout(() => location.hash = '/', 100)
                },
                xhr  => {
                    this.setState({
                        currentUser: null,
                        loading: false,
                        validationError : xhr.responseJSON.message || xhr.responseJSON.error || 'Unknown error'
                    })
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

    onClearValidationError() {
        this.setState({ validationError: null })
    }
}

var authStore = alt.createStore(AuthStore, 'AuthStore')
export default authStore
