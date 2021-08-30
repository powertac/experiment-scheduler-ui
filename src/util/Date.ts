import moment from 'moment';

export function formatDate(date: number|null): string {
    if (null === date || -1 === date) {
        return '&mdash;';
    }
    const dateMoment: moment.Moment = moment(date);
    return dateMoment.format('L HH:mm');
}
