import alt   from '../alt'

class MedActions
{
    constructor() {
        this.generateActions(
            'load',
            'sort',
            'select',
            'destroy',
            'create',
            'update'
        );
    }

    resizeColumn(firstCol, firstSize, secondCol, secondSize) {
        firstCol.width = firstSize;
        this.dispatch();
    }
}

var medActions = alt.createActions(MedActions)
export default medActions
