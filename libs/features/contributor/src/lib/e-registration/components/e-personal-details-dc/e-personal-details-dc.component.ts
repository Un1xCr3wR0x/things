import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityTypeEnum, LookupService, LovList, Person } from '@gosi-ui/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'cnt-e-personal-details-dc',
  templateUrl: './e-personal-details-dc.component.html',
  styleUrls: ['./e-personal-details-dc.component.scss']
})
export class EPersonalDetailsDcComponent implements OnInit {

  @Input() personalDetails:Person;
  @Input() currentDate=new Date();
  @Input() booleanList: LovList;
  @Input() personalDetailForm: FormGroup;


   /** Observables. */
   @Input() specializationList$: Observable<LovList>;
   @Input() educationList$: Observable<LovList>;
   MAX_LENGTH =10;

   
  constructor(readonly fb: FormBuilder,
    readonly lookupService: LookupService,
    ) {}

  ngOnInit(): void {
    
    
  }

}
