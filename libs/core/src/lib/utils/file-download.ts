/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This function is used to download file
 * @param filename (with extention)
 * @param filetype
 * @param data
 */
export const downloadFile = (fileName: string, type: string, data) => {
  if (data) {
    const blobObject = new Blob([data], {
      type: type
    });
    const docLink = document.createElement('a');
    if (docLink.download !== undefined) {
      const url = URL.createObjectURL(blobObject);
      docLink.setAttribute('href', url);
      docLink.setAttribute('download', fileName);
      docLink.style.visibility = 'hidden';
      document.body.appendChild(docLink);
      docLink.click();
      document.body.removeChild(docLink);
      URL.revokeObjectURL(url);
    }
  }
};
