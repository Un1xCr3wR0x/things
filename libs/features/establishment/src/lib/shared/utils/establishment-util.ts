import { Establishment, ProactiveStatusEnum, RoleIdEnum } from '@gosi-ui/core';
import { LegalEntityEnum, OrganisationTypeEnum } from '../enums';

/**
 * Method to check if main and branch has same valid legal entity
 * @param branchLegalEntity
 * @param mainLegalEntity
 */
export function isLegalEntitySame(branchLegalEntity: string, mainLegalEntity: string) {
  return (
    branchLegalEntity === mainLegalEntity || (isGovOrSemiGov(branchLegalEntity) && isGovOrSemiGov(mainLegalEntity))
  );
}

/**
 * Method to check if legal enitity is gov or semi gov
 * @param legalEntity
 */
export function isGovOrSemiGov(legalEntity: string): boolean {
  if (legalEntity === LegalEntityEnum.GOVERNMENT || legalEntity === LegalEntityEnum.SEMI_GOV) {
    return true;
  } else {
    return false;
  }
}

/**
 * Is Establishment Main
 * @param establishment
 */
export function isEstMain(establishment: { registrationNo: number; mainEstablishmentRegNo: number }) {
  return establishment.registrationNo === establishment.mainEstablishmentRegNo;
}

/**
 * Is Establishment registered through MOL or MCI
 * @param est
 */
export function isEstFromMolMci(est: Establishment) {
  return (
    est?.proactiveStatus === ProactiveStatusEnum.PENDING_MOL_OR_MCI ||
    est?.proactiveStatus === ProactiveStatusEnum.REG_MOL_OR_MCI ||
    (est.molEstablishmentIds?.molOfficeId && est.molEstablishmentIds?.molunId ? true : false)
  );
}
export function isEstRegPending(est: Establishment) {
  return est?.proactiveStatus === ProactiveStatusEnum.PENDING_MOL_OR_MCI;
}

/**
 * Method to check if establishment is gcc or not
 */
export function isGccEstablishment(establishment: Establishment): boolean {
  if (establishment.gccCountry === true) {
    return true;
  }
  return false;
}

/**
 * Method to check if establishment is gcc or not
 */
export function isPGccEstablishment(establishment: Establishment): boolean {
  if (establishment.gccEstablishment.gccProactive === true) {
    return true;
  }
  return false;
}
/**
 * Method to check if establishment is ppa or not
 */
export function isPpaEstablishment(establishment: Establishment): boolean {
  if (establishment.ppaEstablishment === true) {
    return true;
  }
  return false;
}

/**
 * Method to check if legal entity falls in the partnership category
 * @param legalEntity
 */
export const isLegalEntityPartnership = (legalEntity: string): boolean => {
  if (
    legalEntity === LegalEntityEnum.GOVERNMENT ||
    legalEntity === LegalEntityEnum.SEMI_GOV ||
    legalEntity === LegalEntityEnum.ORG_REGIONAL ||
    legalEntity === LegalEntityEnum.SOCIETY ||
    legalEntity === LegalEntityEnum.INDIVIDUAL
  ) {
    return false;
  } else {
    return true;
  }
};

/**
 * method to filter gcc and non gcc csr roles
 * @param eligibleRoles
 * @param establishment
 */
export const filterGccCsr = (eligibleRoles: RoleIdEnum[], establishment: Establishment): RoleIdEnum[] => {
  if (establishment?.organizationCategory?.english === OrganisationTypeEnum.GCC) {
    return eligibleRoles.filter(role => role !== RoleIdEnum.CSR);
  } else {
    return eligibleRoles.filter(role => role !== RoleIdEnum.GCC_CSR);
  }
};

/**
 * Method to check if legal enitity is org or society
 * @param legalEntity
 */
export function isOrgOrSociety(establishment: Establishment): boolean {
  if (
    establishment?.legalEntity?.english === LegalEntityEnum.ORG_REGIONAL ||
    establishment?.legalEntity?.english === LegalEntityEnum.SOCIETY
  ) {
    return true;
  } else {
    return false;
  }
}
export function isLawTypeCivil(establishment: Establishment): boolean {
  if (
    establishment?.legalEntity?.english === LegalEntityEnum.GOVERNMENT ||
    establishment?.legalEntity?.english === LegalEntityEnum.SEMI_GOV
  ) {
    return true;
  } else {
    return false;
  }
}
/**
 * Method to check if legal entity falls in the partnership category
 * @param legalEntity
 */
export const isLegalEntityPartnershipMci = (legalEntity: string): boolean => {
  if (
    legalEntity === LegalEntityEnum.GOVERNMENT ||
    legalEntity === LegalEntityEnum.SEMI_GOV ||
    legalEntity === LegalEntityEnum.ORG_REGIONAL ||
    legalEntity === LegalEntityEnum.SOCIETY
  ) {
    return false;
  } else {
    return true;
  }
};

/**
 * Method to check if legal entity falls in the individual category
 * @param legalEntity
 */
export const isLegalEntityIndividual = (legalEntity: string): boolean => {
  if (legalEntity === LegalEntityEnum.INDIVIDUAL) {
    return true;
  } else {
    return false;
  }
};
