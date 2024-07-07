import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProactiveDetailsDcComponent } from '@gosi-ui/features/establishment';

@Component({
  selector: 'est-proactive-details-dc',
  template: '',
  providers: [
    {
      provide: ProactiveDetailsDcComponent,
      useClass: ProactiveDetailsDcMockComponent
    }
  ]
})
export class ProactiveDetailsDcMockComponent {
  establishmentForm: FormGroup = new FormGroup({
    crn: new FormGroup({
      number: new FormControl(),
      issueDate: new FormGroup({
        gregorian: new FormControl(),
        hijiri: new FormControl()
      })
    }),
    legalEntity: new FormGroup({
      english: new FormControl(),
      arabic: new FormControl()
    }),
    molEstablishmentIds: new FormGroup({
      molEstablishmentId: new FormControl(),
      molEstablishmentOfficeId: new FormControl(),
      molOfficeId: new FormControl(),
      molunId: new FormControl()
    }),
    license: new FormGroup({
      issueDate: new FormGroup({
        gregorian: new FormControl(),
        hijiri: new FormControl()
      }),
      issuingAuthorityCode: new FormGroup({
        english: new FormControl(),
        arabic: new FormControl()
      }),
      number: new FormControl(),
      expiryDate: new FormGroup({
        gregorian: new FormControl(),
        hijiri: new FormControl()
      })
    }),
    establishmentType: new FormGroup({
      english: new FormControl(),
      arabic: new FormControl()
    }),
    recruitmentNo: new FormControl()
  });
  resetCRNForm() {}
}
