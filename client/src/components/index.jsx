require('../style/style.less');

import PillboxCalendar   from './PillboxCalendar'
import MedicationCabinet from './MedicationCabinet'
import SearchResults     from './SearchResults'
import ProfileForm       from './ProfileForm'
import LoginForm         from './LoginForm'
import RegistrationForm  from './RegistrationForm'
import RouteNotFound     from './RouteNotFound'
import MedicationForm    from './MedicationForm'
import Page              from './Page'

const { Router, Route } = ReactRouter

ReactDOM.render((
    <Router>
        <Route path="" component={Page}>
            <Route path="/"            component={MedicationCabinet}/>
            <Route path="/cabinet"     component={MedicationCabinet}/>
            <Route path="/cabinet/:id" component={MedicationForm}/>
            <Route path="/calendar"    component={PillboxCalendar}/>
            <Route path="/search"      component={SearchResults}/>
            <Route path="/account"     component={ProfileForm}/>
            <Route path="/login"       component={LoginForm}/>
            <Route path="/register"    component={RegistrationForm}/>
            <Route path="/*"           component={RouteNotFound}/>
        </Route>
    </Router>
), document.getElementById('main'))
