/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export function Autobind(_, _2: string, desc: PropertyDescriptor) {
  const orignalMethod = desc.value;
  const bindedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = orignalMethod.bind(this);
      return boundFn;
    }
  };
  return bindedDescriptor;
}
