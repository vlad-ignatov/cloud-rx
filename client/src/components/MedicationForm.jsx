import { Component }  from 'react'
import medStore       from '../stores/meds-store'
import medActions     from '../actions/med-actions'
import MedImagePicker from './MedImagePicker'

export default class MedicationForm extends Component
{
    static defaultProps = {
        medID: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading : true,
            _fetched: null,
            error   : null,
            med     : null,
            responceError: null
        }
        this.onSubmit  = this.onSubmit.bind(this)
    }

    componentWillReceiveProps(props) {
        let medID = props.params.id
        if (this.state._fetched !== medID) {
            this.fetch(medID)
        }
    }

    componentDidMount() {
        this.fetch(this.props.params.id)
    }

    fetch(medID) {
        if (this.state._fetched !== medID) {
            if (medID == 'new') {
                return this.setState({
                    med : { id: null },
                    loading: 0,
                    error: null,
                    responceError: null,
                    _fetched: medID
                })
            }

            $.ajax('/api/meds/' + medID).then(
                med => this.setState({
                    med,
                    loading: 0,
                    responceError: null,
                    _fetched: medID
                }),
                xhr => this.setState({
                    med: null,
                    loading: 0,
                    responceError: xhr.responseJSON.message || xhr.responseJSON.error,
                    _fetched: null
                })
            )
        }
    }

    onSubmit(e) {
        e.preventDefault()
        let formData = new FormData(e.target)
        let isUpdate = this.state.med && this.state.med.id

        this.setState({
            sending: true
        })

        if (isUpdate) {
            medActions.update({
                medID : this.state.med.id,
                formData,
                onSuccess : med => this.setState({
                    med,
                    sending: false,
                    error: null,
                    responceError: null
                }),
                onError: err => this.setState({
                    sending: false,
                    responceError: err
                })
            })
        }
        else {
            medActions.create({
                formData,
                onSuccess: (med) => {
                    this.setState({
                        med,
                        sending: false,
                        error: null,
                        responceError: null
                    })
                },
                onError: (err) => {
                    this.setState({
                        sending: false,
                        responceError: err
                    })
                }
            })
        }
    }

    deleteMed(id) {
        if (confirm('Are you sure you want to delete this medication?')) {
            medActions.destroy({
                id,
                onSuccess() {
                    setTimeout(() => location.hash = '/cabinet', 0)
                }
            })
        }
    }

    render() {
        if (this.state.loading) {
            return (<p className="text-center text-muted">Loading...</p>)
        }

        if (this.state.error) {
            return (
                <p className="text-center text-danger">
                    <i className="glyphicon glyphicon-minus-sign"></i>
                    { ' ' + this.state.error }
                </p>
            )
        }

        let med = this.state.med;
        if (!med) {
            return (
                <p className="text-center text-muted">
                    <br/>
                    <br/>
                    No medication found
                </p>
            )
        }

        return (
            <div>
                <h2 className="page-header">{ med.id ? med.name : 'Add new medication' }</h2>
                { this.state.responceError ? (
                    <div className="alert alert-danger">
                        { this.state.responceError }
                    </div>
                ) : ''}
                <form className="row" onSubmit={ this.onSubmit }>
                    <input type="hidden" name="id" value={ med.id }/>
                    <div className="col-sm-3">
                        <MedImagePicker med={ med }/>
                        <br/>
                        <br/>
                    </div>
                    <div className="col-sm-9">
                        <div className="row">
                            <div className="form-group col-sm-12">
                                <label>Name</label>
                                <input className="form-control" name="name" defaultValue={ med.name }/>
                            </div>
                            <div className="form-group col-sm-6">
                                <label>RxNORM</label>
                                <input className="form-control" name="rxnorm" defaultValue={ med.rxnorm }/>
                            </div>
                            <div className="form-group col-sm-6">
                                <label>NDC</label>
                                <input className="form-control" name="NDC" defaultValue={ med.NDC }/>
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Dosage</label>
                                <input className="form-control" name="dose" defaultValue={ med.dose }/>
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Manifacturer</label>
                                <input className="form-control" name="manufacturer" defaultValue={ med.manufacturer }/>
                            </div>
                            <div className="form-group col-xs-12">
                                <label>Instructions</label>
                                <textarea className="form-control" rows="3" name="instructions" defaultValue={ med.instructions }/>
                            </div>
                            <div className="form-group col-xs-12">
                                <label>Description</label>
                                <textarea className="form-control" rows="6" name="description" defaultValue={ med.description }/>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <hr/>
                        <div className="row">
                            <div className="col-sm-offset-3 col-sm-4
                                                            col-md-3
                                                            col-xs-6">
                                <button className="btn btn-success btn-block" type="submit" ref="submit">
                                    { this.state.sending ? 'Saving...' : 'Save Medication' }
                                </button>
                            </div>
                            <div className="col-sm-offset-1 col-sm-4
                                            col-md-offset-3 col-md-3
                                                            col-xs-6
                                                            text-right">
                                <button
                                    className="btn btn-danger btn-block"
                                    type="button"
                                    onClick={ this.deleteMed.bind( this, med.id ) }>
                                    Delete Medication
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
