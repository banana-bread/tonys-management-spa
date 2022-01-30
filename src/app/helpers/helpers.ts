export const isObject = (val: any) =>
{
    return typeof val === 'object' ? true : false;
}

export const isArray = (val: any) =>
{
    return Array.isArray(val) ? true : false;
}

/**
 * converts a formatted time string in HH:mm (24hr clock) to seconds
 */
export const formattedTimeStringToSeconds = (formattedTime: string): number =>
{   
    const minutesPortionInSeconds = parseInt(formattedTime.split(':')[0]) * 3600;
    const secondsPortionInSeconds = parseInt(formattedTime.split(':')[1]) * 60;

    return minutesPortionInSeconds + secondsPortionInSeconds;
}
