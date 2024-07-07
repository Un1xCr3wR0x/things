import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertService, LookupService, LovList, Person } from '@gosi-ui/core';
import { setAddressFormToAddresses } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { ManagePersonService } from '../../../shared';
import { tap } from 'rxjs/operators';
import { PersonConstants } from '../../../shared/constants/person-constants';

@Component({
  selector: 'cim-update-address-sc',
  templateUrl: './update-address-sc.component.html',
  styleUrls: ['./update-address-sc.component.scss']
})
export class UpdateAddressScComponent implements OnInit {
  addressForms = new FormGroup({});
  cityList: Observable<LovList>;
  countryList: Observable<LovList>;
  idValue: string;

  //Child Variables
  @ViewChild('addressDetails', { static: false })
  addressDcComponent: AddressDcComponent;
  person$: Observable<Person>;
  personId: number;

  constructor(
    public managePersonService: ManagePersonService,
    private lookupService: LookupService,
    readonly alertService: AlertService
  ) {}

  ngOnInit() {
    this.person$ = this.managePersonService.person$.pipe(
      tap(person => {
        if (person) {
          this.personId = person.personId;
        }
      })
    );
    this.countryList = this.lookupService.getGccCountryList();
    this.cityList = this.lookupService.getCityList();
  }

  /**
   * Method to save the address details
   */
  saveAddress() {
    if (this.addressDcComponent.getAddressValidity() === false) {
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.managePersonService
        .patchPersonAddressDetails(this.personId, {
          addresses: setAddressFormToAddresses(this.addressForms),
          currentMailingAddress: this.addressForms.get('currentMailingAddress').value,
          type: PersonConstants.PATCH_ADDRESS_ID
        })
        .subscribe(
          res => this.alertService.showSuccess(res.bilingualMessage),
          err => {
            if (err.error) {
              this.alertService.showError(err.error.message, err.error.details);
            }
          }
        );
    }
  }
}
