import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactDetails, AddressDetails } from '@gosi-ui/core';

@Component({
  selector: 'cim-address-card-dc',
  template: ''
})
export class AddressCardMock {
  @Input() address: AddressDetails;
}

@Component({
  selector: 'cim-bank-details-card-dc',
  template: ''
})
export class BankCardMock {
  @Input() person;
}

@Component({
  selector: 'cim-bank-form-dc',
  template: ''
})
export class BankFormMock {
  @Input() person;
}

@Component({
  selector: 'cim-contact-card-dc',
  template: ''
})
export class ContactCardMock {
  @Input() contactDetails: ContactDetails;
}

@Component({
  selector: 'cim-education-card-dc',
  template: ''
})
export class EducationCardMock {
  @Input() person;
  @Output() editEvent: EventEmitter<any> = new EventEmitter();
}

@Component({
  selector: 'cim-education-form-dc',
  template: ''
})
export class EducationFormMock {
  @Input() person;
  @Output() editEvent: EventEmitter<any> = new EventEmitter();
}

@Component({
  selector: 'cim-person-profile-dc',
  template: ''
})
export class PersonProfileMock {
  @Input() person;
  @Input() isContributor;
  @Input() socialInsuranceNo;
  @Input() active;
}

@Component({
  selector: 'cim-search-person-dc',
  template: ''
})
export class SearchPersonMock {
  @Input() nationalityList;
}
/* 
@Component({
    selector: 'cim-alert-sc',
    template: ''
})
export class AlertSCMock {


}

@Component({
    selector: 'cim-breadcrumb-dc',
    template: ''
})
export class BreadcrumbMock {


} */

/* BreadcrumbMock,AlertSCMock */
export const MOCK_COMPONENTS = [
  SearchPersonMock,
  PersonProfileMock,
  AddressCardMock,
  EducationFormMock,
  BankFormMock,
  BankCardMock,
  ContactCardMock,
  EducationCardMock
];
