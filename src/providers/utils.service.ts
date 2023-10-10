import * as _ from 'lodash';

export class UtilsService {
  /**
   * convert entity to dto class instance
   * @param {{new(entity: E, options: any): T}} model
   * @param {E[] | E} entity
   * @param options
   * @returns {T[] | T}
   */
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[] | E,
    options?: any,
  ): T[] | T {
    if (_.isArray(entity)) {
      // Handle array input
      return (entity as E[]).map((u) => new model(u, options));
    }

    // Handle singular input
    return new model(entity as E, options);
  }

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
