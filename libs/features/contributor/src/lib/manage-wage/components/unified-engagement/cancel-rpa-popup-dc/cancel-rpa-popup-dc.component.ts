import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownItem, LovList } from '@gosi-ui/core/lib/models';
import { AlertService, LookupService } from '@gosi-ui/core/lib/services';
import { ContributorActionEnum } from '@gosi-ui/features/contributor/lib/shared/enums';
import { SearchEngagementResponse } from '@gosi-ui/features/contributor/lib/shared/models/search-engagement-response';
import { getDropDownItem } from '@gosi-ui/features/establishment/lib/shared/utils/helper';
import { noop, Observable, throwError } from 'rxjs';

@Component({
  selector: 'cnt-cancel-rpa-popup-dc',
  templateUrl: './cancel-rpa-popup-dc.component.html',
  styleUrls: ['./cancel-rpa-popup-dc.component.scss']
})
export class CancelRpaPopupDcComponent implements OnInit , OnChanges {

  isSmallScreen: boolean;
  actionList: DropdownItem[];
  rejectReasonList$: Observable<LovList>;
  cancelReason: FormGroup = new FormGroup({});
  monthLabel : string;
  infoMessage : string;
  wageLabel : string;
  totalMonths :number;
  wage:number;
  reasonForCancellation:string;
  reasonCode:string;

  @Input() cancelEngagment : SearchEngagementResponse;
  @Input() rpaDetails : SearchEngagementResponse;
  @Input() cancelReasonList : LovList;

  @Output() hideModal:EventEmitter<void> = new EventEmitter();
  @Output() confirmModel: EventEmitter<any> = new EventEmitter();
  constructor(
    private lookUpService: LookupService,
    private fb: FormBuilder,
    readonly alertService: AlertService
    ) { }

  ngOnInit(): void {

    this.rejectReasonList$ = this.lookUpService.getEstablishmentRejectReasonList();
    this.cancelReason=this.createCancelReasonForm();
    console.log('reason',this.rejectReasonList$);
    console.log('cancelre new',this.cancelReasonList);
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.rpaDetails && changes.rpaDetails.currentValue){
      this.monthLabel = (this.rpaDetails.aggregationRequestFSExist)
                        ? 'CONTRIBUTOR.TOTAL-CONTRIBUTION-MONTHS'
                        : (this.rpaDetails.aggregationRequestLSExist)
                        ? 'CONTRIBUTOR.PPA-TOTAL-CONTRIBUTION-MONTHS'
                        : ''
      this.infoMessage = (this.rpaDetails.aggregationRequestFSExist)
                        ? 'CONTRIBUTOR.CANCEL-RPA-FIRST-SCHEME-INFO'
                        : (this.rpaDetails.aggregationRequestLSExist)
                        ? 'CONTRIBUTOR.CANCEL-RPA-LAST-SCHEME-INFO'
                        : ''
      this.wageLabel = this.rpaDetails.aggregationRequestFSExist ? 'CONTRIBUTOR.WAGE.WAGE' : 'CONTRIBUTOR.LAST-WAGE-DETAILS'
    }
    if(changes.cancelEngagment && changes.cancelEngagment.currentValue){
      this.totalMonths = this.cancelEngagment?.cancellationContribution;
      this.wage= (this.rpaDetails.aggregationRequestFSExist)
                  ? this.cancelEngagment?.cancellationWage
                  : (this.rpaDetails.aggregationRequestLSExist)
                  ? this.cancelEngagment.wageBreakPeriod.wage.totalWage
                  : null
    }
  }
  createCancelReasonForm(){
    return this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }

  confirm(){
    this.cancelReason.markAllAsTouched();
    if(this.cancelReason.valid){
      this.confirmModel.emit(this.reasonCode);
      this.hideModal.emit();
    }
  }

  cancel(){
    this.hideModal.emit();
  }
  
  selectedItem(){
    console.log('selected');
    
  }

   /**
   * To get screen size
   */
   @HostListener('window:resize', ['$event'])
   getScreenSize() {
     const scrWidth = window.innerWidth;
     this.isSmallScreen = scrWidth <= 560 ? true : false;
   }
   selectedValue(val){
    this.reasonCode=this.cancelReasonList.items.find(item=> item.value.english == val).code.toString();
    
   }

}
