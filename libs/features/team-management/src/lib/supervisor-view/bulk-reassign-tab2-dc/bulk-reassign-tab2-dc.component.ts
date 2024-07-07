import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import {AlertService, BilingualText, Channel, ValidatorStatus, endOfDay, startOfDay} from '@gosi-ui/core';
import { ReassignService } from '../../shared/services/reassign.service';
import {  BlockPeriod, BlockPeriodModalTypeEnum, RouterConstants, StatusLabelEnum, TeamManagementService, VacationPeriod, VacationResponse, ValidatorProfile } from '../../shared';
 
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'gosi-ui-bulk-reassign-tab2-dc',
  templateUrl: './bulk-reassign-tab2-dc.component.html',
  styleUrls: ['./bulk-reassign-tab2-dc.component.scss']
})
export class BulkReassignTab2DcComponent implements OnInit , OnDestroy {


  @Input() blockPeriods: BlockPeriod[] = [];
  /**
   * local variables
   */
  type = BlockPeriodModalTypeEnum;
  blockPeriod: BlockPeriod;
  modalRef: BsModalRef;
  empName: any;
  openEmployeeDetails: boolean = false;
  roles: any;
  isErrorOnProfile: boolean = false;
  errorMessage: string;
  lang = 'en';
  invalidEmp: boolean = false;
  vacationStartDate: string;
  vacationEndDate: string;
  vacationReason: string;
  form: FormGroup = new FormGroup({});
  userId: string;
  startDate: string;
  endDate: string;
  validatorProfileDetails = new ValidatorProfile();
  

  @ViewChild('addBlock') addBlock: TemplateRef<HTMLElement>;
  @ViewChild('modifyBlock') modifyBlock: TemplateRef<HTMLElement>;
  @ViewChild('removeBlock') removeBlock: TemplateRef<HTMLElement>;
  
   /**
   *
   * @param tmService
   * * @param datePipe
   */
  constructor( 
    readonly alertService: AlertService,
    readonly reassignService: ReassignService,
    readonly datePipe: DatePipe,
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly teamManagementService: TeamManagementService  ) { }

  ngOnInit(): void {
    let  add_block_btn = document.querySelector("div[class='add-btn']") as HTMLElement;
    add_block_btn.style.display = "none"; 

    
    add_block_btn = document.querySelector("gosi-button-dc[id='add-block']") as HTMLElement;
    add_block_btn.style.display = "none"; 
   }

   

  loadEmployeeDetails(){
    this.alertService.clearAlerts();
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllSuccessAlerts();
    this.blockPeriods = [];
    let stopEmailEmpID = document.querySelector("input[id='stopEmailEmpID']") as HTMLInputElement;

    this.reassignService.getEmployeeDetails(stopEmailEmpID.value).subscribe(res => {
      this.empName = res.longNameArabic;
      if (res.gosiscp != 'null') {
        this.roles = (JSON.parse(res.gosiscp))[0].role;
      }
      this.openEmployeeDetails = true;
      this.userId = res.userId;
      this.teamManagementService.getVacationPeriods(res.userId,false).subscribe((res :BlockPeriod[]) => {
      
        this.blockPeriods = res;
        let  add_block_btn = document.querySelector("div[class='add-btn']") as HTMLElement;
        add_block_btn.style.display = ""; 
        add_block_btn = document.querySelector("gosi-button-dc[id='add-block']") as HTMLElement;
        add_block_btn.style.display = ""; 
      },error => {
          this.errorMessage = error.errMsg
      })

    },error => {
      this.openEmployeeDetails = false;
      this.isErrorOnProfile = true;
      if (this.lang == 'en') {
        this.errorMessage = error.error.message.english;
      }
      else {
        this.errorMessage = error.error.message.arabic;
      }
      this.invalidEmp = true;
    }
    );
   
    
  }
  

 /**
   * method to open modal
   * @param action
   * @param item
   */
 openModal(action: string, blockPeriod?: BlockPeriod) {
  
  //this.getVacationPeriods();
  //this.getActiveVactionPeriod();

  this.form = this.fb.group({
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
    reason: [null, Validators.compose([Validators.required, Validators.maxLength(100)])]
  });
  if (action === this.type.ADD_BLOCK) {
    this.showModal(this.addBlock, 'lg');
  }else if (action === this.type.MODIFY_BLOCK) {
    this.blockPeriod = blockPeriod;
    this.showModal(this.modifyBlock, 'lg');
  } else {
    this.blockPeriod = blockPeriod;
    this.startDate = this.datePipe.transform(blockPeriod?.startDate, 'dd/MM/yyyy');
    this.endDate = this.datePipe.transform(blockPeriod?.endDate, 'dd/MM/yyyy');
    this.showModal(this.removeBlock, 'lg');
  }
}


setVacationPeriod() {
  this.alertService.clearAlerts();
  const vacationObject: VacationPeriod = {
    endDate: endOfDay(new Date(this.form.get('endDate').value))
      .toISOString()
      .slice(0, -1),
    reason: this.form.get('reason').value,
    startDate: startOfDay(new Date(this.form.get('startDate').value))
      .toISOString()
      .slice(0, -1),
    userId: this.userId
  };
  this.teamManagementService.setVacationPeriods(vacationObject).subscribe((response: VacationResponse) => {
    this.alertService.showSuccess(response.message);
    this.getVacationPeriods();
    this.getActiveVactionPeriod();
  });
  this.hideModal();
}
  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to hide modal. */
  hideModal(): void {
    if (this.modalRef) this.modalRef.hide();
    this.form?.reset();
  }

updateVacationPeriod() {
  this.alertService.clearAlerts();
  const vacationObject: VacationPeriod = {
    endDate: this.form.get('endDate').dirty
      ? endOfDay(this.form.get('endDate').value).toISOString().slice(0, -1)
      : endOfDay(this.blockPeriod.endDate).toISOString().slice(0, -1),
    reason: this.form.get('reason').value,
    startDate: this.form.get('startDate').dirty
      ? startOfDay(this.form.get('startDate').value).toISOString().slice(0, -1)
      : startOfDay(this.blockPeriod.startDate).toISOString().slice(0, -1),
    userId: this.userId
  };
  this.teamManagementService
    .updateVacationPeriods(vacationObject, this.blockPeriod.employeeVacationId)
    .subscribe((response: VacationResponse) => {
      this.alertService.showSuccess(response.message);
      this.getVacationPeriods();
      this.getActiveVactionPeriod();
    });
  this.hideModal();
}

onConfirm() {
  this.alertService.clearAlerts();
  this.deleteVacationPeriod(this.blockPeriod);
}

/**
   *
   * @param blockPeriod method to delete vacation period
   */
deleteVacationPeriod(blockPeriod: BlockPeriod) {
  this.alertService.clearAlerts();
  this.teamManagementService.deleteVacationPeriods(blockPeriod).subscribe((response: BilingualText) => {
    this.alertService.showSuccess(response);
    this.getVacationPeriods();
    this.getActiveVactionPeriod();
  });
  this.hideModal();
}
ngOnDestroy() {
  this.teamManagementService.validatorProfile = null;
}

getVacationPeriods() {
  this.teamManagementService.getVacationPeriods(this.userId).subscribe((res: BlockPeriod[]) => {
    this.blockPeriods = res;
  });
}

getActiveVactionPeriod() {
  this.teamManagementService.getVacationPeriods(this.userId, true).subscribe(res => {
    this.getCurrentStatus(res);
    this.getCurrentStatus(res);
  });
}

getCurrentStatus(response) {
  if (response?.length === 1) {
    if (response[0]?.channel === Channel.TAMAM) {
      this.validatorProfileDetails.statusLabel = StatusLabelEnum.BLOCKED;
      this.validatorProfileDetails.status = ValidatorStatus.BLOCKED;
    } else {
      this.validatorProfileDetails.statusLabel = StatusLabelEnum.BLOCKED;
      this.validatorProfileDetails.status = ValidatorStatus.BLOCKED;
    }
  } else if (response?.length === 0) {
    this.validatorProfileDetails.statusLabel = StatusLabelEnum.ACTIVE;
    this.validatorProfileDetails.status = ValidatorStatus.ACTIVE;
  }
}
}

