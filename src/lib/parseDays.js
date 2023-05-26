
export function parseDays (dateString) {
    const targetDate = new Date(dateString); // March 2, 2022
    const currentDate = new Date();
    const timeDifference = targetDate.getItem() - currentDate.getTime();
    const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return numberOfDays;
};