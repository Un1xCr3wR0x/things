import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export const TeamManagementData = {
  totalCount: 10,
  response: [
    {
      name: 'ay',
      id: 'e001234',
      mail: 'asddff@gfh.com',
      mobile: '1234567890',
      pendingTransaction: 10,
      status: 'Active',
      statusLabel: 'ACTIVE',
      role: [{ role: ['customercareofficer'] }]
    },
    {
      name: 'an',
      id: 'e001244',
      mail: 'asddff@gfh.com',
      mobile: '1234567800',
      pendingTransaction: 1,
      status: 'Active',
      statusLabel: 'ACTIVE',
      role: [{ role: ['customercareofficer'] }]
    }
  ]
};
export const CountData = {
  activeCount: 3,
  inActiveCount: 4
};
export const ActiveReportee = {
  reportees: [
    {
      adreferenceid: 'kh026212',
      gosiscp: '[{"role":["121","141","142"]}]',
      manager: 'uid=e0028088,ou=employee,ou=internalusers,ou=users,dc=gosi,dc=com,dc=sa',
      mail: 'salosaimi@gosi.gov.sa',
      userreferenceid: '26212',
      displayName: 'سلطان بن ماجد العصيمي',
      mobile: 'null',
      containerDN: 'ou=Employee,ou=InternalUsers,ou=Users,dc=gosi,dc=com,dc=sa',
      userId: 'e0026212',
      roles: [
        {
          role: ['121', '141', '142']
        }
      ]
    }
  ]
};
export const BlockPeriodData = {
  channel: 'tamam',
  userId: 'e0026212',
  startDate: null,
  endDate: null,
  reason: 'reason',
  status: '3',
  employeeVacationId: '1234e'
};
export const UserProfileData = {
  preferredLanguage: 'ar',
  gosiscp: '[{"role":["121","141","142"]}]',
  userreferenceid: 'BH26212',
  mobile: '956743456788',
  userId: 'e0026212',
  email: 'sdg@sr.com',
  longNameArabic: '--',
  role: [{ role: ['customercareofficer'] }]
};
export const reporteeObject = {
  name: 'ay',
  id: 'e001234',
  mail: 'asddff@gfh.com',
  mobile: '1234567890',
  pendingTransaction: 10,
  status: 'Active',
  statusLabel: 'ACTIVE',
  role: [{ role: ['customercareofficer'] }]
};
export const PriorityList = {
  priorityMap: {
    HIGH: 0,
    LOW: 10,
    MEDIUM: 0
  },
  transactionMap: {
    COMPLETED: 2,
    REASSIGNED: 3,
    ASSIGNED: 5
  },
  performanceMap: {
    RETURN: 0,
    REJECT: 0
  },
  totalCount: 10
};
export class ProfileForm {
  fb: FormBuilder = new FormBuilder();
  getForm: any;
  constructor() {}
  public createProfileForm(): FormGroup {
    return this.fb.group({
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      reason: [null, Validators.compose([Validators.required])]
    });
  }
}
