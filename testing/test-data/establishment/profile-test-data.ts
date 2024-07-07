import {
  AdminRoleEnum,
  AdminWrapper,
  AssignedRole,
  BranchList,
  CertificateDetailsResponse,
  CertificateEligibiltyWrapper
} from '@gosi-ui/features/establishment';
import { genericEstablishmentResponse, genericPersonResponse } from './change-establishment-test-data';

// import { AdminWrapper, EstablishmentGroup } from '@gosi-ui/features/establishment';
// import { genericPersonResponse } from './change-establishment-test-data';

export const genericEstablishmentGroups: BranchList[] = [
  {
    name: { english: 'Dr Nice', arabic: '' },
    roles: [{ english: 'Partnership', arabic: '' }],
    registrationNo: genericEstablishmentResponse.registrationNo
  },
  {
    name: { english: 'Narco', arabic: '' },
    roles: [{ english: 'Partnership', arabic: '' }],
    registrationNo: 100011182
  },
  {
    name: { english: 'Bombasto', arabic: '' },
    roles: [{ english: 'Partnership', arabic: '' }],
    registrationNo: 100011182
  },
  {
    name: { english: 'Celeritas', arabic: '' },
    roles: [{ english: 'Partnership', arabic: '' }],
    registrationNo: 100011182
  },
  {
    name: { english: 'Magneta', arabic: '' },
    roles: [{ english: 'Partnership', arabic: '' }],
    registrationNo: 100011182
  }
].map(item => ({ ...new BranchList(), ...item }));

export const genericAdminWrapper: AdminWrapper = {
  admins: [
    {
      person: genericPersonResponse,
      roles: [{ english: AdminRoleEnum.SUPER_ADMIN, arabic: 'test' }]
    },
    {
      person: genericPersonResponse,
      roles: [{ english: AdminRoleEnum.BRANCH_ADMIN, arabic: 'test' }]
    },
    {
      person: genericPersonResponse,
      roles: []
    }
  ]
};

export const roleList: AssignedRole = {
  roleList: ['Owner', 'Contributor', 'Sponsor']
};
export const noRole: AssignedRole = {
  roleList: ['No Role']
};

export const genericCertificateEligibiltyResponse: CertificateEligibiltyWrapper = {
  isEligible: false,
  certificate: [
    {
      message: [
        {
          arabic: 'فضلا قم باستكمال بيانات المنشأة لتتمكن من استفادة من خدمات المؤسسة',
          english: "please complete establishment details to enable GOSI's services."
        },
        {
          arabic: 'Establishment status is not eligible for certificate generation.',
          english: 'Establishment status is not eligible for certificate generation.'
        }
      ],
      estName: { english: 'Good Payment Certificate', arabic: '' },
      registrationNo: 213513
    },
    {
      message: [
        {
          arabic: 'Establishment status is not eligible for certificate generation.',
          english: 'Establishment status is not eligible for certificate generation.'
        }
      ],
      estName: { english: 'Zakat Certificate', arabic: '' },
      registrationNo: 213513
    }
  ]
};

export const genericCertificateDetailsResponse: CertificateDetailsResponse = {
  message: 'test',
  certificateNo: 123
};
