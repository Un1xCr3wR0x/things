import { PayloadKeyEnum, RouterData, Role } from '@gosi-ui/core';

const map = new Map();
map.set(PayloadKeyEnum.REGISTRATION_NO, 300001297);
map.set(PayloadKeyEnum.ID, 114142097);
map.set(PayloadKeyEnum.PERSON_ID, null);

export const genericRouteData: RouterData = {
  documentFetchTypes: undefined,
  taskId: 'asd-qw-asdasdasd',
  assignedRole: Role.VALIDATOR_1,
  resourceType: null,
  assigneeName: undefined,
  assigneeId: undefined, // Assignee Name - user
  previousOwnerRole: undefined, // Previous Assigned Role - Validator,Validator1,estadmin,Validator2
  route: undefined, //Multiple identifiers (registrationNo & social insurance number)
  resourceId: undefined, // If single identifier (registrationNo)
  tabIndicator: undefined,
  payload: `{'${PayloadKeyEnum.REGISTRATION_NO}' : '300001297'}, '${PayloadKeyEnum.ID}':'114142097', '${PayloadKeyEnum.PERSON_ID}': 'null'`,
  tabId: undefined,
  transactionId: 12345698,
  sourceChannel: undefined,
  idParams: map,
  state: undefined,
  content: undefined,
  customActions: [],
  draftRequest: undefined,
  userComment: [],
  tpaComments: [],
  initiatorUserId: undefined,
  initiatorRoleId: undefined,
  initiatorCommentDate: undefined,
  initiatorComment: undefined,
  comments: [],
  selectWizard: undefined,
  priority: null,
  schema: null,
  channel: null,
  fromJsonToObject: json => new RouterData()
};
