import { Component }     from 'react'

export default class Calendar extends Component
{

    constructor(...args) {
        super(...args)
        this.state = {
            height: this.getHeight(),
            selectedDate : Date.now()
        }
    }

    getHeight() {
        return $(window).height() - 150
    }

    componentDidMount() {
        $(window).on('resize.calendar', () => {
            this.setState({ height: this.getHeight() })
        })
    }

    componentWillUnmount() {
        $(window).off('resize.calendar')
    }

    renderDay(date) {
        let today      = new Date()
        let weekDay    = date.getDay()
        let monthDay   = date.getDate()
        let classNames = ['weekday-' + weekDay]
        let isToday    = date.getFullYear() === today.getFullYear() &&
                         date.getMonth()    === today.getMonth() &&
                         date.getDate()     === today.getDate()

        if (isToday) {
            classNames.push('today')
        }

        return (
            <td key={date} className={classNames.join(' ')}>
                <div className="day-num">{ monthDay }</div>
            </td>
        )
    }

    render() {

        var date  = new Date(this.state.selectedDate);
        var today = new Date()

        // go to the start of the month
        date.setDate(1); // go to the start of the month


        // go to the start of the week
        var day = date.getDay(); // day of week (0-6)
        if (day > 0) {
            date.setDate(-day);
            day = 0;
        }


        var rows = [], cells;
        for (let wk = 0; wk < 5; wk++) {
            cells = []
            for (let wd = 0; wd < 7; wd++) {
                let n = date.getDate();
                cells.push(this.renderDay(date))
                date.setDate(n + 1);
            }
            rows.push((<tr key={wk}>{ cells }</tr>))
        }

        return (
            <div className="row meds-calendar">
                <table className="col-xs-12" style={{height: this.state.height}}>
                    <thead>
                        <tr>
                            <th>Sun</th>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th>Sat</th>
                        </tr>
                    </thead>
                    <tbody>
                        { rows }
                    </tbody>
                </table>
            </div>
        );
    }
}
