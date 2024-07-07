import { Role, RouterConstants } from '@gosi-ui/core';

const stringJson = '{"registrationNo": "123","socialInsuranceNo": "1234","engagementId" : "20006272"}';

export const routerMockToken = {
  taskId: 'asd-qw-asdasdasd',
  assigneeId: null,
  assignedRole: Role.VALIDATOR_1,
  previousOwnerRole: null,
  resourceType: RouterConstants.TRANSACTION_ADD_IQAMA,
  route: null,
  resourceId: null,
  payload: stringJson
};
