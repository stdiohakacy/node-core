/**
 * Add seconds
 */
export function addSeconds(date: Date, seconds: number): Date {
    date.setSeconds(date.getSeconds() + seconds);
    return date;
}
