import { of } from 'rxjs';
import {
  RegisterMedicalSessionDetails,
  SessionMemberResponse,
  SessionDetails,
  MbDetails
} from '@gosi-ui/features/medical-board';

export class CreateSessionServiceStub {
  registerMedicalBoardSession(registerMedicalSessionDetails: RegisterMedicalSessionDetails) {
    if (registerMedicalSessionDetails) {
      return of(new SessionMemberResponse());
    }
  }
  updateRegularMedicalBoardSession(registerMedicalSessionDetails: RegisterMedicalSessionDetails) {
    if (registerMedicalSessionDetails) {
      return of(new SessionMemberResponse());
    }
  }
  getMbDetails() {
    return of(new MbDetails());
  }
  getSessionDetails() {
    return of(new SessionDetails());
  }
}
