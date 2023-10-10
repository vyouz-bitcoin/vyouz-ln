export class UtilsService {
  static objectToQueryParam(obj = {} as any) {
    const params = [];

    Object.keys(obj).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(obj[key]);
        params.push(`${encodedKey}=${encodedValue}`);
      }
    });

    const paramsResult = params.join('&');
    return paramsResult ? `?${paramsResult}` : '';
  }
}
