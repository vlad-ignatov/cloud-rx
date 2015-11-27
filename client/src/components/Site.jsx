import { Component }   from 'react';
import Page            from './Page';
import LoginForm       from './LoginForm';
import MedicationsGrid from './MedicationsGrid';
import authStore       from '../stores/auth-store'
import medStore        from '../stores/meds-store'





export default class Site extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            auth: authStore.getState(),
            meds: medStore.getState()
        };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        authStore.listen(this._onChange);
    }

    componentWillUnmount() {
        authStore.unlisten(this._onChange);
    }

    _onChange() {
        this.setState({
            auth: authStore.getState()
        });
    }

    render() {
        if ( this.state.auth.currentUser && this.state.auth.currentUser.username ) {
            return (
                <Page globalState={ this.state } location={ this.props.location }>
                    <MedicationsGrid style={{height: 300}} withColumnMenu={false}/>
                    {
                        this.state.meds.selectedMedID ?
                        (<pre>Med details</pre>) :
                        ''
                    }
                </Page>
            )
        }

        return (
            <Page globalState={ this.state }>
                <LoginForm/>
            </Page>
        );
    }
}
