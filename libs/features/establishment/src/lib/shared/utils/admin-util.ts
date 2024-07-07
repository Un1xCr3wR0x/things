/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, DropdownItem, getIdentityByType, Lov, LovList, RoleIdEnum } from '@gosi-ui/core';
import { AdminActionEnum, AdminRoleArabicEnum, AdminRoleEnum } from '../enums';
import { Admin, AdminDto, AdminWrapper, ControlPerson } from '../models';
import { SuperAdminDto } from '../models/super-admin-dto';
import { getDropDownItem } from './helper';

type RoleInterface = { roleId: number; role: BilingualText };

const keys = Object.keys(AdminRoleEnum);

export const AdminRoleMap: Map<string, RoleInterface> = new Map();
AdminRoleMap.set(keys[0], getAdminIdAndRole(keys[0]));
AdminRoleMap.set(keys[1], getAdminIdAndRole(keys[1]));
AdminRoleMap.set(keys[2], getAdminIdAndRole(keys[2]));
AdminRoleMap.set(keys[3], getAdminIdAndRole(keys[3]));
AdminRoleMap.set(keys[4], getAdminIdAndRole(keys[4]));
AdminRoleMap.set(keys[5], getAdminIdAndRole(keys[5]));

function getAdminIdAndRole(key: string) {
  return {
    roleId: RoleIdEnum[key],
    role: { english: AdminRoleEnum[key], arabic: AdminRoleArabicEnum[key] }
  };
}

export const otherRoles: BilingualText = {
  english: 'Other Roles',
  arabic: 'وظائف أخرى'
};

export const branchAndOtherOptions: () => LovList = () => {
  const lovList = new LovList([]);
  lovList.items.push({
    ...new Lov(),
    ...{ sequence: 0, value: { english: AdminRoleEnum.BRANCH_ADMIN, arabic: AdminRoleArabicEnum.BRANCH_ADMIN } }
  });
  lovList.items.push({
    ...new Lov(),
    ...{ sequence: 1, value: otherRoles }
  });
  return lovList;
};

/**
 * Method to map admin ids to role
 * @param admins
 */
export function mapAdminIdsToRole(roleIds: number[]): BilingualText[] {
  return roleIds?.map(roleId => {
    let role: BilingualText = new BilingualText();
    AdminRoleMap.forEach((value, key, adminMap) => {
      if (value.roleId === roleId) {
        role = adminMap.get(key).role;
      }
    });
    return role;
  });
}

/**
 * Method to get the bilingual roles associated with the english values
 * @param rolesInEnglish
 */
export function getAdminRole(rolesInEnglish: string[]): BilingualText[] {
  const roles: BilingualText[] = [];
  AdminRoleMap.forEach(value => {
    if (rolesInEnglish.indexOf(value.role.english) !== -1) {
      roles.push(value.role);
    }
  });
  return roles;
}

/**
 * Method to return role ids
 * @param roles
 */
export function mapAdminRolesToId(roles: BilingualText[]): number[] {
  if (roles) {
    return roles.map(role => {
      let roleId: number;
      AdminRoleMap.forEach((value, key, adminMap) => {
        if (value.role.english === role.english) {
          roleId = adminMap.get(key).roleId;
        }
      });
      return roleId;
    });
  } else {
    return [];
  }
}

/**
 * Method to get the data for lov drop downs
 */
export function getOtherRoles(): LovList {
  const roleAdminIds = [RoleIdEnum.REG_ADMIN, RoleIdEnum.CNT_ADMIN, RoleIdEnum.OH_ADMIN];
  return new LovList(
    mapAdminIdsToRole(roleAdminIds).map((res, index) => {
      return { ...new Lov(), ...{ value: res, sequence: index } };
    })
  );
}

/**
 * Assemble admin to admin dto
 * @param admin
 */
export function assembleAdminToAdminDto(admin: Admin): AdminDto {
  if (admin) {
    const adminDto = new AdminDto();
    adminDto.fromJsonToObject(admin.person);
    adminDto.roles = mapAdminRolesToId(admin.roles);
    return adminDto;
  }
  return undefined;
}
/**
 * Assemble admin to admin dto
 * @param admin
 */
export function assembleAdminDtoToSuperAdmin(
  admin: Admin,
  navigationIndicator: number,
  comments: string,
  contentIds = [],
  referenceNo: number
): SuperAdminDto {
  if (admin) {
    const superAdminDto = new SuperAdminDto();
    superAdminDto.fromJsonToObject(admin.person);
    superAdminDto.roles = mapAdminRolesToId(admin.roles);
    superAdminDto.navigationIndicator = navigationIndicator;
    superAdminDto.comments = comments;
    superAdminDto.contentIds = contentIds;
    superAdminDto.referenceNo = referenceNo;
    return superAdminDto;
  }
  return undefined;
}
/**
 * Method to assemble admin dto from backend and to admin model in front end
 * This is to limit the dependency of backend contract to service layer
 * @param adminDtoList
 */
export function assembleAdminDtoToAdmin(adminDtoList: AdminDto[]): Admin[] {
  if (adminDtoList && adminDtoList.length > 0) {
    return adminDtoList.map(adminDto => {
      const admin = new Admin();
      admin.person.fromJsonToObject(adminDto);
      admin.roles = mapAdminIdsToRole(adminDto.roles);
      return admin;
    });
  }
  return [];
}

/**
 * Method to assemble the admins to required model
 * @param adminWrapper
 */
export function mapAdminToControlPersons(adminWrapper: AdminWrapper): ControlPerson[] {
  return adminWrapper?.admins.map(admin => {
    const person: ControlPerson = new ControlPerson();
    person.name = admin.person.name;
    const roles = admin.roles as BilingualText[];
    const roleInEnglish = roles?.map(role => role.english).join(', ');
    const roleInArabic = roles?.map(role => role.arabic).join(', ');
    person.role = roles?.length > 0 ? { english: roleInEnglish, arabic: roleInArabic } : undefined;
    person.sex = admin.person.sex;
    person.commonId = getIdentityByType(admin.person.identity, admin.person.nationality?.english);
    person.commonId.idType = 'ESTABLISHMENT.' + person.commonId.idType;
    return person;
  });
}

export function getCodes(lovs: Array<Lov>, bilinguals: Array<BilingualText>) {
  const codes = bilinguals.reduce((agg, item) => {
    if (lovs?.filter(lov => lov.value.english === item.english)?.length > 0) {
      agg.push(lovs.filter(lov => lov.value.english === item.english)[0]?.code);
    }
    return agg;
  }, []);
  return codes;
}

export const adminActionList = (): DropdownItem[] => {
  const actions: DropdownItem[] = [];
  actions.push(getDropDownItem(AdminActionEnum.ASSIGN, 'plus'));
  actions.push(getDropDownItem(AdminActionEnum.MODIFY, 'pencil-alt'));
  actions.push(getDropDownItem(AdminActionEnum.REPLACE, 'exchange-alt'));
  actions.push(getDropDownItem(AdminActionEnum.DELETE, 'trash'));
  return actions;
};

export const eligibleExternalRolesForAdminView = [
  RoleIdEnum.SUPER_ADMIN,
  RoleIdEnum.GCC_ADMIN,
  RoleIdEnum.BRANCH_ADMIN,
  RoleIdEnum.CNT_ADMIN,
  RoleIdEnum.REG_ADMIN,
  RoleIdEnum.OH_ADMIN,
];

export const eligibleInternalRolesForAdminView = [RoleIdEnum.CSR, RoleIdEnum.GCC_CSR];
