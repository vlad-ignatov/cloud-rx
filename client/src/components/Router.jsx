import authStore from '../stores/auth-store'

export default class Router extends ReactRouter.Router
{
    constructor(...args) {
        super(...args)
        this.state = {
            auth: authStore.getState()
        }
    }

    componentDidMount() {
        //super.componentDidMount()
        authStore.listen(this.onAuthChange)
    }

    componentWillUnmount() {
        //super.componentWillUnmount()
        authStore.unlisten(this.onAuthChange);
    }

    onAuthChange() {
        this.setState({
            auth: authStore.getState()
        })
    }

    render() {
        console.log(this.state);
        if (this.state.auth.currentUser && this.state.auth.currentUser.username) {
            return super.render();
        }
        else {
            if (location.hash.indexOf('#/login') !== 0) {
                location.hash = '/login'
            }
        }
    }
}
