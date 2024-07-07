import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { LovList, LovCategoryList, OccupationList, BilingualText } from '@gosi-ui/core';
import { EngagementDTO, OccupationDetails, EngagementDetailsList, EngagementDetailsDTO, OccupationDetail, OccupationEngagementDetails, DiseaseConstants } from '../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'oh-occupation-details-dc',
  templateUrl: './occupation-details-dc.component.html',
  styleUrls: ['./occupation-details-dc.component.scss']
})
export class OccupationDetailsDcComponent implements OnInit, OnChanges {
  @Input() occupationDetailsForm: FormGroup;
  @Input() engagementDetailsForm: FormArray;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() establishmentName$: LovList;
  @Input() occupationType : BilingualText;
  @Input() occupationsList: LovCategoryList;
  @Input() occupationsCausedDisease: OccupationDetails[];
  @Input() engagementOccupationDetails: EngagementDTO[];
  @Input() engagementDetailsToSave: EngagementDetailsDTO[];
  @Input() isDisabled: boolean;
  @Input() occupationFormFlag: FormGroup;
  @Input() isOccupationsLoaded : boolean;
  @Input() textAreaVisible: boolean;
  @Input() noEngagementResults: boolean;
  @Input() isOccupationSelected: boolean;
  @Input() noEngagementsLoaded: boolean;
  @Input() engagementResults: EngagementDetailsList[];
  @Input() isOccupation = true;
  @Input() occupationDetailsEdit: OccupationEngagementDetails;
  // output variables

  @Output() showNewOccupation: EventEmitter<string> = new EventEmitter();
  @Output() remove: EventEmitter<number> = new EventEmitter();
  @Output() onRemove: EventEmitter<null> = new EventEmitter();
  @Output() getEngagementDetails: EventEmitter<OccupationDetail> = new EventEmitter();
  @Output() saveOccupation: EventEmitter<null> = new EventEmitter();
  @Output() cancelSave: EventEmitter<null> = new EventEmitter();

  /**
   * to Define Local Variables
   */
  maxDate: Date;
  disableDelete: boolean;
  modalRef: BsModalRef;
  occupationList$: Observable<OccupationList>;
  engagementForm = new FormControl();
  isNewOccupationValue = false;
  length: number;
  isDeletedAny: boolean;
  isSavedAfterDelete: boolean;
  saved: boolean;
  occupationName: string; 
  engagementDetailsOfOccupation: EngagementDetailsDTO[]; 

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.engagementResults && changes.engagementResults.currentValue) {
      this.engagementResults = changes.engagementResults.currentValue;
      this.length = this.engagementResults.length;
      if (this.engagementResults && this.engagementResults.length > 0) {
        this.noEngagementResults = false;       
      }      
    }  
    if (changes.occupationDetailsForm && changes.occupationDetailsForm.currentValue) {
      this.occupationDetailsForm = changes.occupationDetailsForm.currentValue;
      if (this.occupationDetailsForm.get('occupationForm') && this.occupationDetailsForm.get('occupationForm').get('occupation')?.value?.english) {
        this.isOccupationSelected = true;
        this.occupationName = this.occupationDetailsForm.get('occupationForm').get('occupation').value.english;
      }else if(this.occupationDetailsForm.get('newOccupationForm') && this.occupationDetailsForm.get('newOccupationForm').get('newOccupation')?.value?.english){
        this.isOccupationSelected = true;
        this.occupationName = this.occupationDetailsForm.get('newOccupationForm').get('newOccupationForm').value.english;
      }
    }
    if (changes.engagementOccupationDetails && changes.engagementOccupationDetails.currentValue) {
      this.engagementOccupationDetails = changes.engagementOccupationDetails.currentValue;
    }
    if (changes.engagementDetailsToSave && changes.engagementDetailsToSave.currentValue) {
      this.engagementDetailsToSave = changes.engagementDetailsToSave.currentValue;
    }
    this.checkIfDeleteDiisabled();
    if(this.occupationType && this.occupationType.english !== DiseaseConstants.MANUAL_OCCUPATION){
      this.isOccupationSelected = true;
    }
    if (changes.isOccupationSelected && changes.isOccupationSelected.currentValue) {
      this.isOccupationSelected = changes.isOccupationSelected.currentValue;
      if (this.isOccupationSelected && this.occupationDetailsForm.get('occupationForm') && this.occupationDetailsForm.get('occupationForm').get('occupation')?.value?.english) {
        this.isOccupationSelected = true;
      }else{
        this.isOccupationSelected = false;
      }   
    }else{
      if (this.isOccupationSelected && this.occupationDetailsForm.get('occupationForm') && this.occupationDetailsForm.get('occupationForm').get('occupation')?.value?.english) {
        this.isOccupationSelected = true;
      }else{
        this.isOccupationSelected = false;
      } 
    }   
    
  }
  checkIfDeleteDiisabled(){ 
    
    if(this.occupationName && this.engagementDetailsToSave && this.engagementDetailsToSave.length>0){
        this.engagementDetailsOfOccupation = this.engagementDetailsToSave.filter(item => item.occupationName.english === this.occupationName && item.isRemoved !== true);        
        if(this.engagementDetailsOfOccupation){
          if(this.engagementDetailsOfOccupation.length>1){
            this.disableDelete = false;
          }else{
            this.disableDelete = true;
          }
        }
    }else{
      let i = 0;
      this.engagementResults.forEach(element => {
        if(element.isRemoved){
          i++;
        }
      });
      if(i === this.engagementResults.length-1){
        this.disableDelete = true;
      }else{
        this.disableDelete = false;
      }
      if (i === this.engagementResults.length) {
        this.noEngagementResults = true;
        this.noEngagementsLoaded = true;
      }
      if(this.engagementResults.length === 1){
        this.disableDelete = true;
      }
    }
  }
  getDetails($event) {
    let occupationDetails: OccupationDetail = new OccupationDetail();
    occupationDetails.occupationName = $event.value;
    occupationDetails.occupationType = $event.category;
    this.getEngagementDetails.emit(occupationDetails);
  }
  showOccupationText($event) {
    this.showNewOccupation.emit($event);
    if($event === "false"){
      this.textAreaVisible = false;  
      this.isOccupationSelected = false;  
    }
  }
  showModal(template: TemplateRef<HTMLElement>) {
    if(!this.disableDelete){
      this.modalRef = this.modalService.show(template);
    }   
  }
  decline() {
    this.modalRef.hide();
  }
  /**
   * Method to Delete an engagement
 */
     
  onDeleteEngagement(item, index: number) { 
    this.engagementResults[index].isRemoved = true;
    this.length = this.length - 1;
    if(this.engagementDetailsToSave && this.engagementDetailsToSave.length>0) {
      this.engagementDetailsToSave.forEach(element => {
        if(element.establishmentName.english === item.establishmentName.english && element.endDate === item.engagementPeriod[0].endDate
          && element.startDate === item.engagementPeriod[0].startDate && element.occupationName.english === item.occupation.english)
          {
            element.isRemoved = true;           
            element.isRemovedFromUI = true;  
            element.isSavedAfterDelete = false;
          }     
      });
   }
    this.checkIfDeleteDiisabled();
    this.modalRef.hide();
  }
  undoDelete(item, index: number) {
    let engagement = this.engagementResults[index];
    engagement.isRemoved = false;
    this.engagementDetailsToSave.forEach(element => {
      if(element.establishmentName.english === item.establishmentName.english && element.endDate === item.engagementPeriod[0].endDate
        && element.startDate === item.engagementPeriod[0].startDate && element.occupationName.english === item.occupation.english)
        {
          element.isRemoved = false;
          element.isRemovedFromUI = false;
        }     
    });
    this.checkIfDeleteDiisabled();
  }
  cancelOccupation() {
    if(this.engagementDetailsToSave && this.engagementDetailsToSave.length>0) {
      this.engagementDetailsToSave.forEach(element => {
        if(element.isRemoved && !element.isSavedAfterDelete){
          element.isRemoved = false;         
        }
        element.isExpanded = false;
      });   
     }
    this.cancelSave.emit();
  }
  save() {
    if(this.engagementDetailsToSave && this.engagementDetailsToSave.length>0) {
      this.engagementDetailsToSave.forEach(element => {
        if(element.isRemoved){
          element.isSavedAfterDelete = true;
        }
      });   
     }
    this.saveOccupation.emit();
  }
  onKeyUp(value: string) {
    if (value && value.length > 0) {
      this.isOccupationSelected = true;
    } else if (value === '') {
      this.isOccupationSelected = false;
    }
  }   
}
