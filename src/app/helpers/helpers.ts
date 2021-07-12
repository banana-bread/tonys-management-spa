export const isObject = (val: any) =>
{
    return typeof val === 'object' ? true : false;
}

export const isArray = (val: any) =>
{
    return Array.isArray(val) ? true : false;
}