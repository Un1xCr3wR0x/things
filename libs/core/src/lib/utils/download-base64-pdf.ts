/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This function is used to download base64 PDF files by opening it in a new window
 * @param base64File (the base64 string itself)
 * @param fileName
 */

export const downloadBase64PDF = (base64File: any, fileName: string) => {
  var byteCharacters = atob(base64File);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  var byteArray = new Uint8Array(byteNumbers);
  var file = new Blob([byteArray], { type: 'application/pdf;base64, ' });
  var fileURL = URL.createObjectURL(file);
  const navigator = window.navigator;

  if (navigator.userAgent.includes('Safari')) {
    const docLink = document.createElement('a');
    docLink.setAttribute('href', fileURL);
    docLink.setAttribute('download', fileName);
    docLink.click();
  } else {
    window.open(fileURL, fileName);
  }
};

export const silentDownloadBase64PDF = (base64File: any, fileName: string) => {
  var byteCharacters = atob(base64File);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  var byteArray = new Uint8Array(byteNumbers);
  var file = new Blob([byteArray], { type: 'application/pdf' });
  var fileURL = URL.createObjectURL(file);
  const docLink = document.createElement('a');
  docLink.setAttribute('href', fileURL);
  docLink.setAttribute('download', fileName);
  document.body.appendChild(docLink);
  docLink.click();
  document.body.removeChild(docLink);
};
