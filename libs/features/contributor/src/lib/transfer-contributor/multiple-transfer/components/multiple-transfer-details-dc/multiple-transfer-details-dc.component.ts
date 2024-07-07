import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList } from '@gosi-ui/core';
import { BranchDetails, Establishment } from '@gosi-ui/features/contributor/lib/shared';
import { ContributorDetailsFilter } from '@gosi-ui/features/contributor/lib/shared/models/contributor-details-filter';
import { TransferableEngagements } from '@gosi-ui/features/contributor/lib/shared/models/transferableEngagements';
import moment from 'moment';

@Component({
  selector: 'cnt-multiple-transfer-details-dc',
  templateUrl: './multiple-transfer-details-dc.component.html',
  styleUrls: ['./multiple-transfer-details-dc.component.scss']
})
export class MultipleTransferDetailsDcComponent implements OnInit {
/** Local variables */
  transferMultipleDetailsForm: FormGroup = new FormGroup({});
    /**Input variables */
    @Input() parentForm: FormGroup = new FormGroup({});
    @Input() contributorSelectedList:TransferableEngagements[] = [];
    @Input() registrationNo : number;
    @Input() contributorList:TransferableEngagements[] = [];
    @Input() totalNumberOfActiveContributors:number;
    @Input() totalNumberOfActiveContributorsFixed:number;
    @Input() establishment: Establishment;
    @Input() registrationNoList = [];
    @Input() establishmentNameList = [];
    @Input() branchList: BranchDetails[] = [];
    @Input() establishmentType: LovList;
    @Input() paginationId:any;
    @Input() itemsPerPage: number;
    @Input() pageDetails = {
      currentPage: 1,
      goToPage: '1'
    };
    @Input()  verified:boolean;
      /** Output variables */
  @Output() showAlert = new EventEmitter<string>(null);
  @Output() searchEvent: EventEmitter<string> = new EventEmitter();
  @Output() selectPageEventSc: EventEmitter<number> = new EventEmitter();
  @Output() filterData: EventEmitter<ContributorDetailsFilter> = new EventEmitter();
  @Output() verifiedBooleanEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();





  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.transferMultipleDetailsForm = this.createTransferMultipleForm();
    this.parentForm.addControl('transferMultipleForm', this.transferMultipleDetailsForm);
    this.setFormValues()
  }
  ngOnChanges(changes: SimpleChanges) {
	if(changes.totalNumberOfActiveContributorsFixed && changes.totalNumberOfActiveContributorsFixed.currentValue)
		{
      this.transferMultipleDetailsForm.get('totalContributor').setValue(this.totalNumberOfActiveContributorsFixed);
    }
    if(changes.branchList && changes.branchList.currentValue)  
      {
        this.setEstDetails(this.registrationNo,true);
      }
  }

  verifiedBoolean(value){
    this.verified = value;
    this.verifiedBooleanEmitter.emit(this.verified);
  }

  setFormValues(){
    this.transferMultipleDetailsForm.get('registrationNoFrom').setValue(this.registrationNo);
    this.transferMultipleDetailsForm.get('transferDate.gregorian').setValue(moment(new Date()).format('DD/MM/YYYY'));
  }
  /**Method to create transfer form */
  createTransferMultipleForm(): FormGroup {
    return this.fb.group({
      registrationNoFrom: [null, Validators.required],
      establishmentNameFrom: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      transferDate: this.fb.group({
        gregorian: [{ value: new Date(), disabled: true }],
        hijiri: []
      }),
      totalContributor: [0, Validators.required],
      registrationNoTo: [null, Validators.required],
      establishmentNameTo: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      establishmentTypeTo: this.fb.group({
        english: [null, Validators.required],
        arabic: [null, Validators.required]
      }),
      joiningDate: this.fb.group({
        gregorian: [{ value: new Date(), disabled: true }],
        hijiri: []
      })
    });
  }

    /**
   * Method to establishment details for from and to
   * @param value
   * @param isFrom
   */
    setEstDetails(value: string | number, isFrom = false): void {
      if (typeof value === 'number') {
        this.branchList.forEach(branch => {
          if (branch.registrationNo === value) {
            this.transferMultipleDetailsForm
              .get(isFrom ? 'establishmentNameFrom.english' : 'establishmentNameTo.english')
              .setValue(branch.name.english ? branch.name.english : branch.name.arabic);
            this.transferMultipleDetailsForm
              .get(isFrom ? 'establishmentTypeFrom' : 'establishmentTypeTo')
              .setValue(branch.establishmentType);
          }
        });
      } else {
        this.branchList.forEach(branch => {
          if (branch.name.english === value || branch.name.arabic === value) {
            this.transferMultipleDetailsForm
              .get(isFrom ? 'registrationNoFrom' : 'registrationNoTo')
              .setValue(branch.registrationNo);
            this.transferMultipleDetailsForm
              .get(isFrom ? 'establishmentTypeFrom' : 'establishmentTypeTo')
              .setValue(branch.establishmentType);
          }
        });
      }
      this.checkSameEst();
    }
  
    /**Method to check if from and to are same establishment */
    checkSameEst(): void {
      if (
        this.transferMultipleDetailsForm.get('registrationNoFrom').value ===
        this.transferMultipleDetailsForm.get('registrationNoTo').value
      )
        this.showAlert.emit('CONTRIBUTOR.TRANSFER-CON.SAME-ESTABLISHMENT-FROM-TO');
    }
  
    /** Method to set establishment details for transfer To.  */
    getEstDetailsTo(value: string | number): void {
      if (value) {
        this.showAlert.emit(null);
        this.setEstDetails(value);
      }
    }
  
    selectPage(pageNumber: number): void {
        this.selectPageEventSc.emit(pageNumber);
    }
    
  searchContributorByIdentifier(identifier:string){
    this.searchEvent.emit(identifier);
  }
  filterContributorList(filterRequest){
    this.filterData.emit(filterRequest)
  }

}
