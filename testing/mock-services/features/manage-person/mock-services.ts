import { Person, Contributor, EstablishmentProfile, BilingualText } from '@gosi-ui/core';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { of, throwError, BehaviorSubject, Observable } from 'rxjs';
import { BaseRouterServiceStub } from '../../core/routing-service-stub';
import { contractsTestData } from 'testing/test-data/features/customer-information';
import {
  bankDetailsReponse,
  contributorSearchResponse,
  documentResonseItemList,
  EngagementData,
  feedbackMessageResponse,
  genericError,
  getEstablishmentProfile,
  getWorkflowResponse,
  personResponse,
  terminatePayloadResponse
} from '../../../test-data/features/customer-information/components/test-data';
import { PersonBankDetails } from '@gosi-ui/features/customer-information/lib/shared';

/**
 * Mock for Change Person Service
 */
export class ChangePersonServiceMock {
  verifyPersonDetails(formData: any) {
    if (formData) {
      return null;
    }
  }

  getActiveStatus(personId) {
    if (personId) {
    }
  }

  patchPersonBankDetails(personId, requestData) {
    return null;
  }
  patchPersonContactDetails(personId, requestData) {
    return null;
  }
  patchPersonEducationDetails(personId, requestData) {
    return null;
  }
  getBankDetails() {
    return of(bindToObject(new PersonBankDetails(), bankDetailsReponse));
  }
  getBeneficiaryDetails(personId: any) {
    if (personId) {
      return throwError(genericError);
    }
  }
}

export class ModalServiceStub {
  show(content: any, config?: ModalOptions) {
    if (content || config) {
    }
  }
  hide() {}
}

function bindToObject(object, data) {
  Object.keys(object).forEach(name => {
    if (name in data) {
      object[name] = data[name];
    }
  });
  return object;
}

//Mock service for managepersonservicestub
export class ManagePersonFeatureServiceStub {
  private _contributorSubject: BehaviorSubject<Contributor> = new BehaviorSubject(null);
  contributor$: Observable<Contributor> = this._contributorSubject.asObservable();
  private _personSubject: BehaviorSubject<Person> = new BehaviorSubject(null);
  person$: Observable<Person> = this._personSubject.asObservable();
  private _establishmentProfileSubject: BehaviorSubject<EstablishmentProfile> = new BehaviorSubject(null);
  establishmentProfile$: Observable<EstablishmentProfile> = this._establishmentProfileSubject.asObservable();
  registrationNo: number;
  constructor() {}

  //Method to add address details
  patchPersonAddressDetails() {}
  //Method to search an contributor under an establishment applicable for admin/csr
  searchContributor(estIdentifier, cntIdentifier) {
    if (estIdentifier || cntIdentifier) {
      return of(contributorSearchResponse);
    }
  }

  // method to set the contributor data in the contributor
  setContributor(contributorData) {
    if (contributorData) {
    }
  }

  //Getter Method
  getContributor() {
    return contributorSearchResponse;
  }

  getEstablishmentProfile(regNo) {
    if (regNo) {
      return of(getEstablishmentProfile);
    }
  }

  revertTransaction() {
    return of(null);
  }

  updateTaskWorkflow() {
    return of(null);
  }

  patchContributorDetails(type, requestData) {
    if (type || requestData) {
      return of(feedbackMessageResponse);
    }
  }

  patchIdentityDetails(type, requestData) {
    if (type || requestData) {
      return of(feedbackMessageResponse);
    }
  }

  patchPersonDetails(personId, type, requestData) {
    if (personId || type || requestData) {
      return of(feedbackMessageResponse);
    }
  }
  /**
   * Mock method to get establishment reg no
   */
  getEstablishmentRegistrationNo() {
    return 200085744;
  }

  /**
   * Mock method to get workflowdetails
   * @param regNo
   * @param personId
   */
  getWorkFlowDetails(regNo, personId) {
    if (regNo || personId) {
      return of(getWorkflowResponse);
    }
  }
  /**
   * method to get engagements
   */
  getEngagements(registrationNo, socialInsuranceNo) {
    if (registrationNo || socialInsuranceNo) return of(EngagementData);
  }
  /**
   * This method is to set the registration no
   * @param registrationNo
   */
  setEstablishmentRegistrationNo(registrationNo) {
    if (registrationNo) {
    }
  }

  /**
   * This method is used to get the engagement status of contributor
   * @param personId
   */
  getActiveStatus(personId) {
    if (personId) {
      return of(bindToObject(new Person(), personResponse));
    }
  }

  /**
   * This method is used to verify the person identifiers applicable for User
   * @param formData
   */
  verifyPersonDetails(formData) {
    if (formData) {
    }
  }

  //Method to set person details
  setPerson(personData) {
    if (personData) {
    }
  }

  //Method to set Establishment Profile
  setEstablishmentProfile() {}

  //Methos to emit search success event
  emitSearchSuccessEvent() {}

  //Method to get active status
  getActiveStatusIfContributor(person) {
    if (person) {
    }
  }

  //Method to get the work flow status
  getWorkFlowStatus() {
    return null;
  }

  //Method to get the documents
  getDocuments() {
    return documentResonseItemList;
  }

  //Method to check document uploaded
  checkDocumentUploaded(documentList) {
    if (documentList) {
      return throwError(genericError);
    }
  }

  //Mock method for getting task details
  getTaskDetails(resourceType: string, isContributor: boolean) {
    if (isContributor !== null) {
      return of({
        inboxEntries: [
          {
            taskId: 'q234msdf2343',
            user: resourceType
          }
        ]
      });
    }
  }

  terminateAllActiveEngagements(socialInsuranceNo = 123123, payload = terminatePayloadResponse) {
    if (socialInsuranceNo || payload) {
      return of(true);
    }
  }
}

export class ManagePersonRoutingServiceStub extends BaseRouterServiceStub {
  /**
   * This method is to set global token to manage person token to use across the library
   */
  setToLocalToken() {}
  /**
   * Method to navigate to update address
   */
  navigateToUpdateAddress() {}
  /**
   * Manage Internal Routing
   */
  navigateTo(resourceType) {
    if (resourceType) {
    }
  }

  /**
   * Method to navigate to profile screen
   */
  navigateToProfilePage() {}

  /**
   * This method is to navigate to the validator
   */
  navigateToValidator() {}

  /**
   * This method is to navigate to the contributor search
   */
  navigateToContributorSearch() {}

  /**
   * Method to navigate ot addiqama screen
   */
  navigateToAddIqama() {}

  /**
   * Method to navigate ot add border screen
   */
  navigateToAddBorder() {}

  /**
   * Mock method to reset the manage person token
   */
  resetLocalToken() {}
}

export class ManageDocumentServiceStub {
  getContracts(registrationNo: string, socialInsuranceNo: string) {
    if (registrationNo || socialInsuranceNo || !registrationNo) {
      return of(contractsTestData);
    }
  }
}
