import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { AlertService, convertToYYYYMMDD } from '@gosi-ui/core';
import { ContributorDetailsFilter } from '@gosi-ui/features/contributor/lib/shared/models/contributor-details-filter';
import { TransferableEngagements } from '@gosi-ui/features/contributor/lib/shared/models/transferableEngagements';


@Component({
  selector: 'cnt-multiple-transfer-individual-details-dc',
  templateUrl: './multiple-transfer-individual-details-dc.component.html',
  styleUrls: ['./multiple-transfer-individual-details-dc.component.scss']
})
export class MultipleTransferIndividualDetailsDcComponent implements OnInit {
  resetSearch: boolean;
  searchBoolean:boolean =false;
  contributorSelectedSearchList:TransferableEngagements[] = [];
  checkListValue: FormArray = new FormArray([]);
  selectedContributors:number=0;
  hasFilter: Boolean = false;
  maximumDate: Date;
  joiningDateFormControl = new FormControl();
  filterRequest : ContributorDetailsFilter =new ContributorDetailsFilter();
  tempCheckData = [];
  pageDetailsSelected = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationIds = 'paginationContributorSelected';
  pageDetailsSearch = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationIdSearch = 'paginationIdSearch'

  @Input() contributorSelectedList:TransferableEngagements[] = [];
  @Input() contributorList:TransferableEngagements[] = [];
  @Input() totalNumberOfActiveContributors:number;
  @Input() totalNumberOfActiveContributorsFixed:number;
  @Input() paginationId:any;
  @Input() itemsPerPage: number;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  @Input()  verified:boolean;
  
  @Output() selectPageEvent: EventEmitter<number> = new EventEmitter();
  @Output() searchEvent: EventEmitter<string> = new EventEmitter();
  @Output() filterData: EventEmitter<ContributorDetailsFilter> = new EventEmitter();
  @Output() verifiedBooleanEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(readonly fb: FormBuilder,
    private alertService:AlertService
    ) { }

  ngOnInit(): void {
    this.maximumDate=new Date();
  }

  verifyContributorDetails(){
    this.searchEvent.emit(null);
    this.resetSearch = true;
    this.verified = true; 
    this.verifiedBooleanEmitter.emit(this.verified);
    this.resetContributorSelectedPAge();
  }

  resetForm(){
    this.contributorSelectedList = [];
    this.selectedContributors = 0;
    this.tempCheckData = [];
    // this.checkListValue.reset();
  }

  searchContributorByIdentifier(identifier:string){
    this.resetSearch = false;
    if(this.verified){
      const identity = identifier? parseInt( identifier.trim()): null;
      if(identity){ 
        this.searchBoolean = true;
        this.contributorSelectedSearchList = this.contributorSelectedList.filter(user=> user.personIdentifier == identity);
      }else this.searchBoolean = false;
    }
    else if(identifier!=null) this.searchEvent.emit(identifier.trim());
    else this.searchEvent.emit(identifier);
  }
    
     /** Method to reset page. */
  resetPage() {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = '1';
    this.selectPageEvent.emit(this.pageDetails.currentPage);
  }

  resetContributorSelectedPAge(){
    this.pageDetailsSelected.currentPage = 1;
    this.pageDetailsSelected.goToPage = '1';
  }

 
  paginateContributors(pageNumber: number): void {
      this.selectPageEvent.emit(pageNumber);
  }
  paginateSelectedContributor(pageNumber: number): void {
    if (this.pageDetailsSelected.currentPage !== pageNumber) this.pageDetailsSelected.currentPage = pageNumber;
  }

  paginateSearchContributor(pageNumber: number): void {
    if (this.pageDetailsSearch.currentPage !== pageNumber) this.pageDetailsSearch.currentPage = pageNumber;
  }


  getSelectedList(){
    let start = (this.pageDetailsSelected.currentPage-1)*10;
    let end = this.pageDetailsSelected.currentPage*10;
    end = end>this.selectedContributors? this.selectedContributors: end;
    return this.contributorSelectedList.slice(start,end);
  }
  
  removeList(list){
    const i = this.tempCheckData.indexOf(list.personIdentifier);
    this.tempCheckData.splice(i, 1);
    this.contributorSelectedList = this.contributorSelectedList.filter(user => user.personIdentifier !== list.personIdentifier);
    this.selectedContributors =  this.selectedContributors - 1;
    if(this.searchBoolean){ 
      this.contributorSelectedSearchList =[];
      this.searchBoolean = false;
    }
    if(this.contributorSelectedList.length==0){ 
      this.verified = false;
      this.verifiedBooleanEmitter.emit(this.verified);
    }
  }

  addContributorDetails(){
    this.verified = false; 
    this.verifiedBooleanEmitter.emit(this.verified);
    this.resetSearch = true;
    this.searchBoolean = false;
  }

  applyFilter(){
    if (this.joiningDateFormControl.value) {
      this.filterRequest.joiningDate.fromDate = convertToYYYYMMDD(this.joiningDateFormControl.value[0]);
      this.filterRequest.joiningDate.toDate = convertToYYYYMMDD(this.joiningDateFormControl.value[1]);
    } else {
      this.filterRequest.joiningDate.fromDate = undefined;
      this.filterRequest.joiningDate.toDate = undefined;
    }
    this.filterData.emit(this.filterRequest)
  }

  clearFilterForm(){
    this.joiningDateFormControl.reset();
    this.filterRequest.joiningDate.fromDate = undefined;
    this.filterRequest.joiningDate.toDate = undefined;
    this.filterData.emit(this.filterRequest)
  }


  checkboxChanged(event,list) {
    const id = event.srcElement.id; //Get the id of the checkbox
    if (event.target.checked){ this.tempCheckData.push(id); //If checked, add to array
       this.contributorSelectedList.push(list);
       this.selectedContributors =  this.selectedContributors + 1;
  }
    else { //if unchecked, remove from the array
        const i = this.tempCheckData.indexOf(id);
        this.tempCheckData.splice(i, 1);
        this.contributorSelectedList = this.contributorSelectedList.filter(user => user.personIdentifier !== list.personIdentifier);
        this.selectedContributors =  this.selectedContributors - 1;
    }
}

showAlertConfirmBtn() {
  this.alertService.showErrorByKey('CONTRIBUTOR.WAGE.WAGE-NO-CHANGE');
}

toggleCheckBox(elementId){
  return (this.tempCheckData.indexOf(elementId) != -1) ? true : false;
}


}
