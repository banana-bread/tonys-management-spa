export const getQueryParam = (url: string, param: string): string|null => 
{
    let reg = new RegExp( '[?&]' + param + '=([^&#]*)', 'i' );
    let queryString = reg.exec(url);
    return queryString ? queryString[1] : null;
}

export const getUuid = (string: string): string|null =>
{
    const result = string.match(/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/);
    return result ? result[0] : null;
}