import appDispatcher from './Dispatcher';
import * as Constants from './constants';

var actions = {

    login(username, password) {
        appDispatcher.handleViewAction({
            actionType: Constants.USER_LOGIN,
            username,
            password
        });
    },

    logout() {
        appDispatcher.handleViewAction({
            actionType: Constants.USER_LOGOUT
        });
    }
};

export default actions;
