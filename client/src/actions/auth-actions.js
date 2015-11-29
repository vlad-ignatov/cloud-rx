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
            'register',
            'clearValidationError'
        );
    }
}

var authActions = alt.createActions(AuthActions);
export default authActions;
