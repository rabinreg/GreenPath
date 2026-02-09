export function calculateDateDifference(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
}

export function addDaysToDate(date: Date, days: number): Date {
    const resultDate = new Date(date);
    resultDate.setDate(resultDate.getDate() + days);
    return resultDate;
}

export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
}