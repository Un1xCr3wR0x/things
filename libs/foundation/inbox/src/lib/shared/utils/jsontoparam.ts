/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
// Method to generate GET URL
export function generateURL(url, requestData) {
  const result = [];
  if (requestData.filter && requestData.filter.assigneeId) {
    const assigneeId = requestData.filter.assigneeId;
    const newRequestData = JSON.parse(JSON.stringify(requestData));
    if (newRequestData.filter.assigneeId) delete newRequestData.filter.assigneeId;
    jsonToParam(newRequestData, undefined, undefined, result);
    return `${url}/${assigneeId}?${result.join('&')}`;
  } else {
    jsonToParam(requestData, undefined, undefined, result);
    return `${url}/${result.join('&')}`;
  }
}

//Method to convert JSON to GET request parameters
export function jsonToParam(obj, paramKey, finalParam, result) {
  Object.keys(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      obj[key].forEach(element => {
        finalParam =
          finalParam === undefined
            ? paramKey + '.' + key + '=' + element
            : finalParam + '&' + paramKey + '.' + key + '=' + element;
      });
      return finalParam;
    } else if (obj[key] && typeof obj[key] === 'object') {
      paramKey = paramKey === undefined ? key : paramKey + '.' + key;
      jsonToParam(obj[key], paramKey, finalParam, result);
    } else {
      finalParam =
        finalParam === undefined
          ? paramKey + '.' + key + '=' + obj[key]
          : finalParam + '&' + paramKey + '.' + key + '=' + obj[key];
      return finalParam;
    }
    paramKey = undefined;
  });
  if (finalParam !== undefined) result.push(finalParam);
}
