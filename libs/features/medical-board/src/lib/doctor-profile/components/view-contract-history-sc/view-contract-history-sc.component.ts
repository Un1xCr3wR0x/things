import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  LanguageToken,
  statusBadgeType,
  BilingualText,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { noop, BehaviorSubject, empty } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContractsHistory, ContractHistoryList } from '../../../shared';
import { DoctorService } from '../../../shared/services';
import { PersonTypeEnum } from '../../../shared/enums/person-type-enum';

@Component({
  selector: 'mb-view-contract-history-sc',
  templateUrl: './view-contract-history-sc.component.html',
  styleUrls: ['./view-contract-history-sc.component.scss']
})
export class ViewContractHistoryScComponent implements OnInit {
  modalRef: BsModalRef;
  identificationNo: number;
  contractId: number;
  lang = 'en';
  contractHistory: ContractHistoryList[] = [];
  contractType: BilingualText;
  typeContractedFlag: boolean;
  typeVisitingFlag: boolean;
  typeNurseFlag: boolean;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly doctorService: DoctorService,
    readonly alertService: AlertService,
    readonly router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
      this.route.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('identificationNo')) this.identificationNo = +params.get('identificationNo');
          if (params && params.get('contractId')) {
            this.contractId = +params.get('contractId');
            this.getContractHistory(this.identificationNo, this.contractId);
          }
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
       this.language.subscribe(language => (this.lang = language));
  }
  getContractHistory(identificationNo, contractId: number) {
    if(this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.doctorService.getContracDoctortHistory(identificationNo,contractId).subscribe(
        (res: ContractsHistory) => {
          this.contractHistory = res.contractHistories;
          this.contractType = res.contractType;
          this.typeContractedFlag = this.contractType.english === PersonTypeEnum.ContractedDoctor ? true : false;
          this.typeVisitingFlag = this.contractType.english === PersonTypeEnum.VisitingDoctor ? true : false;
          this.typeNurseFlag = this.contractType.english === PersonTypeEnum.Nurse ? true : false;
        },
        err => this.showError(err)
      );
    } else {
      this.doctorService.getContractHistory(identificationNo, contractId).subscribe(
        (res: ContractsHistory) => {
          this.contractHistory = res.contractHistories;
          this.contractType = res.contractType;
          this.typeContractedFlag = this.contractType.english === PersonTypeEnum.ContractedDoctor ? true : false;
          this.typeVisitingFlag = this.contractType.english === PersonTypeEnum.VisitingDoctor ? true : false;
          this.typeNurseFlag = this.contractType.english === PersonTypeEnum.Nurse ? true : false;
        },
        err => this.showError(err)
      );
    }
  }
  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(status) {
    if (status) {
      return statusBadgeType(status);
    }
  }

  /**
   *
   * @param err This method to show the page level error
   */
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
}
