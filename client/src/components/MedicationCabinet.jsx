import { Component }     from 'react'
import MedicationsGrid   from './MedicationsGrid'

const { Link } = ReactRouter

export default class MedicationCabinet extends Component
{

    constructor(...args) {
        super(...args)
        this.state = { height: this.getHeight() }
    }

    getHeight() {
        return Math.max($(window).height() - 190, 200)
    }

    componentDidMount() {
        $(window).on('resize.grid', () => {
            this.setState({ height: this.getHeight() })
        })
    }

    componentWillUnmount() {
        $(window).off('resize.grid')
    }

    render() {
        return (
            <div>
                <MedicationsGrid style={{ height: this.state.height }} withColumnMenu={false}/>
                <div className="text-right">
                    <Link to="/cabinet/new" className="btn btn-success" style={{ marginTop: 15 }}>
                        <i className="glyphicon glyphicon-plus-sign">&nbsp;</i>
                        Add Medication
                    </Link>
                </div>
            </div>
        );
    }
}
