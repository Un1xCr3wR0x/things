/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {
  AlertService, ApplicationTypeEnum, ApplicationTypeToken,
  BilingualText, Channel,
  DropdownItem, IdentityTypeEnum,
  Iqama,
  LoginService,
  NationalId,
  NIN
} from '@gosi-ui/core';
import { Observable } from 'rxjs';
import {Admin, AdminActionEnum, BranchList, FilterKeyValue} from '../../../shared';
import { FormGroup } from '@angular/forms';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'est-administrating-branches-dc',
  templateUrl: './administrating-branches-dc.component.html',
  styleUrls: ['./administrating-branches-dc.component.scss']
})
export class AdministratingBranchesDcComponent implements OnInit {
  @Input() branchList: BranchList[];
  @Input() totalBranches: number;
  @Input() itemsPerPage = 5;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  @Input() currentPage = 1;
  @Input() paginationId = 'administratingBranch';
  @Input() branchSearchParam;
  @Input() actionDropDown: Array<DropdownItem>;
  @Input() roles$: Observable<BilingualText[]>;
  @Input() branchFilters: Array<FilterKeyValue>;
  @Input() searchForm: FormGroup;
  @Input() isLoading = false;
  @Input() selectedAdmin : Admin;
  @Input() loggedInAdminId : number;
  modalRef: BsModalRef;
  private modalService: BsModalService;
  isAppPublic = true;

  // @Output() assign: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() filterApply = new EventEmitter<Array<FilterKeyValue>>();
  @Output() pageIndexEvent: EventEmitter<number> = new EventEmitter();
  // @Output() editRole: EventEmitter<BranchList> = new EventEmitter();
  @Output() actionType: EventEmitter<string> = new EventEmitter();
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    modalService:BsModalService, readonly alertService: AlertService,
      readonly loginService: LoginService
  ) {
    this.modalService=modalService;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC;

  }

  ngOnInit(): void {}
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (page !== this.pageDetails.currentPage) {
      this.pageIndexEvent.emit(page);
    }
  }

  applyFilter(filters: Array<FilterKeyValue>) {
    this.filterApply.emit(filters);
  }

  leaveGroupAction(template:TemplateRef<HTMLElement>){
    const modelSize = 'modal-md';
    this.modalRef = this.modalService.show(template,Object.assign({}, {class:`${modelSize} modal-dialog-centered`}));
  }

  cancelLeaveGroup(){
    this.modalRef.hide();
  }

  confirmLeaveGroup(){
    this.alertService.showSuccessByKey('ESTABLISHMENT.LEAVE-GROUP-ALERT');
    this.actionType.emit(AdminActionEnum.DELETE);
    this.modalRef.hide();
  }

  compareIdNum(): boolean {
    switch (this.selectedAdmin.person.identity[0].idType) {
      case IdentityTypeEnum.IQAMA:
        return Number((this.selectedAdmin.person.identity[0] as Iqama).iqamaNo) === Number(this.loggedInAdminId);
      case IdentityTypeEnum.NIN:
        return Number((this.selectedAdmin.person.identity[0] as NIN).newNin ) === Number(this.loggedInAdminId);
      case IdentityTypeEnum.NATIONALID:
        return Number((this.selectedAdmin.person.identity[0]  as NationalId).id) === Number(this.loggedInAdminId);
    }
  }

}
