import { Component } from 'react'
import DataGrid      from 'react-datagrid'
import medStore      from '../stores/meds-store'
import medActions    from '../actions/med-actions'

require('react-datagrid/index.css')

export default class MedicationsGrid extends Component
{
    constructor(props) {
        super(props)
        this.state = medStore.getState()
        this._onStoreChange = this._onStoreChange.bind(this)
        this.onColumnOrderChange = this.onColumnOrderChange.bind(this)
        this.onColumnResize = this.onColumnResize.bind(this)
        this.onSelectionChange = this.onSelectionChange.bind(this)
    }

    componentDidMount() {
        medStore.listen(this._onStoreChange)
        medActions.load()
    }

    componentWillUnmount() {
        medStore.unlisten(this._onStoreChange)
    }

    _onStoreChange() {
        this.setState(medStore.getState())
    }

    onColumnResize(firstCol, firstSize, secondCol, secondSize)
    {
        firstCol.width = firstSize;
        this.setState({});
    }

    onColumnOrderChange(index, dropIndex)
    {
        var col = this.state.columns[index];
        this.state.columns.splice(index, 1); //delete from index, 1 item
        this.state.columns.splice(dropIndex, 0, col);
        this.setState({});
    }

    onSelectionChange(newSelectedId) {
        medActions.select(newSelectedId)
    }

    render()
    {
        return (
            <DataGrid { ...this.props }
                idProperty="id"
                dataSource={ this.state.meds }
                columns={ this.state.columns }
                onColumnResize={ this.onColumnResize }
                onColumnOrderChange={ this.onColumnOrderChange }
                sortInfo={ this.state.sortInfo }
                onSortChange={ medActions.sort }
                loading={this.state.isLoading}
                selected={this.state.selectedMedID}
                onSelectionChange={this.onSelectionChange}
            />
        );
    }
}
