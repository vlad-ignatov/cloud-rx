import alt from '../alt';

class AuthActions
{
    constructor() {
        this.generateActions(
            'login',
            'logout',
            'updateProfile',
            'changePassword',
            'deleteProfile',
            'register'
        );
    }
}

var authActions = alt.createActions(AuthActions);
export default authActions;
