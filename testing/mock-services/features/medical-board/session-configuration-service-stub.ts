import {
  HoldSessionDetails,
  SessionRequest,
  ConfigurationWrapper,
  IndividualSessionDetails,
  StopSessionDetails
} from '@gosi-ui/features/medical-board';
import { of } from 'rxjs';
import { BilingualText } from '@gosi-ui/core';
import { SessionStatusDetails } from 'libs/features/medical-board/src';

export class SessionConfigurationServiceStub {
  onHoldMbSession(templateId: number, holdSessionDetails: HoldSessionDetails) {
    return of(new BilingualText());
  }

  getConfigurationList(listRequest: SessionRequest) {
    if (listRequest) {
      return of(new ConfigurationWrapper());
    }
  }
  /**
   * Method to get individual session details
   */
  getIndividualSessionDetails(templateId: number) {
    return of(new IndividualSessionDetails());
  }

  onStopMbSession(templateId: number, stopSessionDetails: StopSessionDetails) {
    return of(new BilingualText());
  }
  removeHoldSession(templateId: number, stopSessionDetails: StopSessionDetails) {
    return of(new BilingualText());
  }
  holdMedicalBoardSession(sessionId: number, request) {
    return of(new BilingualText());
  }
  getSessionStatusDetails(sessionId: number) {
    if (sessionId) {
      return of(new SessionStatusDetails());
    }
  }
}
