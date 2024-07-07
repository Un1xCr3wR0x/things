import { RoleIdEnum } from '@gosi-ui/core';

export const internalRoles: RoleIdEnum[] = Object.keys(RoleIdEnum).reduce((agg, key) => {
  if (RoleIdEnum[key] > 100) {
    agg.push(RoleIdEnum[key]);
  }
  return agg;
}, []);
