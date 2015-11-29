import sorty      from 'sorty'
import alt        from '../alt'
import medActions from '../actions/med-actions'

var __meds__ = []

class MedStore
{
    constructor() {
        this.meds = []
        this.selectedMedID = null
        this.sortInfo = []
        this.columns = [
            { name: 'rxnorm'      , type: 'string', title: 'Rxnorm'      , width: 100 },
            {
                name: 'name',
                type: 'string',
                title: 'Name',
                render: v => (<b>{ v }</b>)
            },
            { name: 'NDC'         , type: 'string', title: 'NDC'         , width: 100 },
            { name: 'dose'        , type: 'string', title: 'Dose'        , width: 100 },
            { name: 'instructions', type: 'string', title: 'Instructions', width: 130 },
            { name: 'manufacturer', type: 'string', title: 'Manufacturer', width: 130 }
        ];
        this.isLoading = false;

        this.bindListeners({
            onSort   : medActions.SORT,
            onLoad   : medActions.LOAD,
            onSelect : medActions.SELECT,
            onDestroy: medActions.DESTROY,
            onCreate : medActions.CREATE,
            onUpdate : medActions.UPDATE
        })
    }

    onLoad(action) {
        this.setState({ isLoading: true })
        $.ajax('/api/meds').then(
            (meds) => {
                __meds__ = meds
                this.setState({
                    meds : sorty(this.sortInfo, [].concat(__meds__)),
                    isLoading: false
                })
            },
            (...args) => {
                this.setState({
                    isLoading: false
                })
                console.error(...args)
            }
        )
    }

    onDestroy({ id, onSuccess }) {
        this.setState({ isLoading: true })
        $.ajax({
            url    : `/api/meds/${id}`,
            method : 'DELETE'
        }).then(
            (med) => {
                __meds__ = __meds__.filter(m => m.id !== id)
                this.setState({
                    meds : this.meds.filter(m => m.id !== id),
                    isLoading: false
                })
                if (typeof onSuccess == 'function') {
                    onSuccess()
                }
            },
            (...args) => {
                this.setState({
                    isLoading: false
                })
                console.error(...args)
            }
        )
    }

    onSelect(id=null) {
        this.selectedMedID = id
        setTimeout(() => location.hash='/cabinet/' + id, 100)
    }

    onSort(sortInfo) {
        // console.log(sortInfo[0])
        this.setState({
            sortInfo : sortInfo,
            meds     : sorty(sortInfo, [].concat(__meds__))
        })
    }

    onCreate({ formData, onSuccess, onError }) {
        this.setState({ isLoading: true })
        $.ajax({
            url        : '/api/meds/',
            method     : 'POST',
            data       : formData,
            contentType: false,
            processData: false
        }).then(
            med => {
                __meds__.push(med);
                this.setState({
                    meds : sorty(this.sortInfo, [].concat(__meds__)),
                    isLoading: false
                })
                if (typeof onSuccess == 'function') {
                    onSuccess(med)
                }
            },
            xhr => {
                this.setState({
                    isLoading: false
                })
                if (typeof onError == 'function') {
                    onError(xhr.responseJSON.message || xhr.responseJSON.error || 'Unknown error')
                }
            }
        )
    }

    onUpdate({ medID, formData, onSuccess, onError }) {
        this.setState({ isLoading: true })
        $.ajax({
            url        : '/api/meds/' + medID,
            method     : 'PUT',
            data       : formData,
            contentType: false,
            processData: false
        }).then(
            med => {
                let m1 = __meds__.find(m => m.id === med.id)
                let m2 = this.meds.find(m => m.id === med.id)

                if (m1 && m2) {
                    $.extend(m1, med)
                    $.extend(m2, med)
                }

                this.setState({ isLoading: false })
                if (typeof onSuccess == 'function') {
                    onSuccess(med)
                }
            },
            xhr => {
                this.setState({ isLoading: false })
                if (typeof onError == 'function') {
                    onError(xhr.responseJSON.message || xhr.responseJSON.error || 'Unknown error')
                }
            }
        )
    }
}

var medStore = alt.createStore(MedStore, 'MedStore')
export default medStore
