/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/** This method is to scroll window to top. */
export const scrollToTop = function () {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 500);
};
/**
 * This method to scroll to specified position
 * @param xPos
 * @param yPos
 */
export const scrollToPosition = function (xPos: number, yPos: number) {
  window.scrollTo(xPos, yPos);
};
/**
 * This method to get x,y coodinates of an element
 * @param elemObj
 */
export const getScreenCoordinates = function (elemObj) {
  let pos = { xPos: 0, yPos: 0 };
  // pos.xPos = elemObj.offsetLeft;
  // pos.yPos = elemObj.offsetTop;
  while (elemObj.offsetParent) {
    pos.xPos += elemObj.offsetParent.offsetLeft;
    pos.yPos += elemObj.offsetParent.offsetTop;
    if (elemObj === document.getElementsByTagName('body')[0]) break;
    else elemObj = elemObj.offsetParent;
  }
  return pos;
};
export const scrollToModalError = function () {
  if (document.getElementsByClassName('modal-body')) {
    if (document.getElementsByClassName('modal-content-wrapper')) {
      document.getElementsByClassName('modal-content-wrapper')[0].scrollTop = 0;
    }
  }
};
