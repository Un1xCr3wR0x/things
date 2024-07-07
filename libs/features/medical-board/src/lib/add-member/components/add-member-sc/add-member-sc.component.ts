import { Component, OnInit, ViewChild, Inject, OnDestroy, TemplateRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  BPMUpdateRequest,
  DocumentItem,
  DocumentService,
  DocumentSubmitItem,
  IdentityTypeEnum,
  Iqama,
  LookupService,
  LovList,
  NationalId,
  NationalityTypeEnum,
  Passport,
  scrollToTop,
  startOfDay,
  WizardItem,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  RouterDataToken,
  RouterData,
  WorkflowService,
  WorkFlowActions,
  RouterConstants,
  RouterConstantsBase,
  TransactionStatus,
  Transaction,
  GosiCalendar
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { noop, Observable, of, throwError } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, delay, tap, switchMap } from 'rxjs/operators';
import { MBConstants, MbRouteConstants } from '../../../shared/constants';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  MedicalBoardWizardTypes,
  NationalityCategoryEnum
} from '../../../shared/enums';
import { MemberData, MemberDetails } from '../../../shared/models';
import { MemberService, MedicalBoardService } from '../../../shared/services';
import { AddMemberBaseSc } from '../../../shared/components';
import { AddMemberExistResponse } from '../../../shared/models/add-member-exist-response';

import { BankService } from '@gosi-ui/features/benefits/lib/shared/services/bank.service';

@Component({
  selector: 'mb-add-member-sc',
  templateUrl: './add-member-sc.component.html',
  styleUrls: ['./add-member-sc.component.scss']
})
export class AddMemberScComponent extends AddMemberBaseSc implements OnInit, OnDestroy {
  /** Local variables */
  mbwizardItems: WizardItem[] = [];
  currentTab = 0;
  totalTabs = 4;
  member: MemberData = new MemberData();
  verified = false;
  hasInitialised = false;
  referenceNo: number = undefined;
  isSaved: boolean;
  comments: string;
  documentList: DocumentItem[];
  errMessage = {
    english: 'Id not present in database',
    arabic: 'Id not present in database'
  };
  updateBpmTask: BPMUpdateRequest = new BPMUpdateRequest();
  hasperson = false;
  isPrivate: boolean;
  isComments = false;
  memberDetails: MemberDetails;
  editMode: boolean;
  value: boolean;
  AddMemberExistResponse: AddMemberExistResponse;
  personDetails: MemberData;
  mbDetail;

  /** Child components. */
  @ViewChild('memberExistTemplate', { static: false })
  private verifyRequestModal: TemplateRef<HTMLElement>;
  @ViewChild('addMemberTabs', { static: false })
  addMemberTabs: TabsetComponent;
  @ViewChild('addMemberWizard', { static: false })
  addMemberWizard: ProgressWizardDcComponent;
  identifier: number;
  personBirthDate: GosiCalendar;

  constructor(
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly memberService: MemberService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly mbService: MedicalBoardService,
    readonly workflowService: WorkflowService,
    readonly bankService: BankService
  ) {
    super(alertService, documentService, lookUpService, memberService, router, appToken, routerDataToken);
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.initializeWizard();
    this.verified = false;
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    super.setLovLists();
    this.setRouteParams();
  }

  /** Method to set  flag based on the route params. */
  setRouteParams() {
    if (this.router.url.indexOf('/edit') >= 0) {
      if (this.routerDataToken.payload) super.initializeToken();
      if (this.mbService.medicalProfessionalId || this.mbService.identifier) {
        this.professionalId = this.mbService.medicalProfessionalId;
        this.contractId = this.mbService.contractId;
        this.referenceNo = this.mbService.transactionRefNo;
        this.identifier = this.mbService.identifier;
      }

      this.updateBpmTask.taskId = this.routerDataToken.taskId;
      this.updateBpmTask.user = this.routerDataToken.assigneeId;

      if (this.routerDataToken.state === 'RETURN' && this.routerDataToken.userComment.length > 0) {
        // Defect 537026: The comment of the MB manager not appear in the screen of MB officer transaction that returned from MB manager
        this.isComments = true;
      }
      // comments not required in draft
      else {
        this.isComments = false;
      }

      this.getDataForEdit();
      this.verified = true;
      this.mbwizardItems[0].isActive = true;
      this.mbwizardItems[0].isDisabled = false;
      this.hasInitialised = true;
      this.editMode = true;
    }
  }

  /** Method to fetch data for edit on return. */
  getDataForEdit() {
    if (this.professionalId && this.contractId) {
      this.memberService.getMemberDetails(this.professionalId, this.contractId).subscribe(
        res => {
          this.members = res.member;
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      const identificationNo = this.identifier;
      this.memberService.getMemberTransactionApi(identificationNo).subscribe(
        res => {
          if (res.recordCount > 0) {
            this.mapValue(res?.listOfPersons[0]);
            this.personDetails = res?.listOfPersons[0];
          } else {
            this.alertService.showError(this.errMessage);
          }
          this.bankService.getBankDetails(this.personDetails.personId).subscribe(bankRes => {
            if (bankRes) {
              this.bankDetails = bankRes;
            }
          });
        },
        err => {
          this.showError(err);
        }
      );
    }
  }

  /** Method to initialize wizard. */
  initializeWizard() {
    this.mbwizardItems = this.getWizardItems();
  }

  /** Method to get wizard items. */
  getWizardItems() {
    return [
      new WizardItem(MedicalBoardWizardTypes.PERSONAL_DETAILS, 'user'),
      new WizardItem(MedicalBoardWizardTypes.CONTRACT_DETAILS, 'file-signature'),
      new WizardItem(MedicalBoardWizardTypes.DOCUMENTS, 'file-alt')
    ];
  }
  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.currentTab = wizardIndex;
  }
  /**
   *
   * verifyExistMember This api is used to check whether the member is already registerd or not
   *  and the response shows error or success message
   */
  verifyMemberDetails(memberFormDetails) {
    this.mbDetail = memberFormDetails;
    const nationality = memberFormDetails.nationality;
    if (nationality.english === NationalityTypeEnum.SAUDI_NATIONAL) {
      const id = memberFormDetails.newNin;
      this.memberService.verifyExistMember(id).subscribe(
        res => {
          this.value = res;
          if (this.value === true) {
            this.showReturnTemplate(this.verifyRequestModal);
          } else {
            memberFormDetails = this.mbDetail;
            this.getMbProfessionalDetails(memberFormDetails);
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else if (MBConstants.GCC_NATIONAL.indexOf(nationality.english) !== -1) {
      const id = memberFormDetails.id;
      const personType = NationalityCategoryEnum.GCC_PERSON;
      this.memberService.verifyExistMember(id).subscribe(
        res => {
          this.value = res;
          if (this.value === true) {
            this.showReturnTemplate(this.verifyRequestModal);
          } else {
            memberFormDetails = this.mbDetail;
            this.getMbProfessionalDetails(memberFormDetails);
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      const id = memberFormDetails.iqamaNo;
      const personType = NationalityCategoryEnum.NON_SAUDI;
      this.memberService.verifyExistMember(id).subscribe(
        res => {
          this.value = res;
          if (this.value === true) {
            this.showReturnTemplate(this.verifyRequestModal);
          } else {
            memberFormDetails = this.mbDetail;
            this.getMbProfessionalDetails(memberFormDetails);
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }
  getMbProfessionalDetails(memberFormDetails) {
    memberFormDetails = this.mbDetail;
    const nationality = memberFormDetails.nationality;
    const birthDate = moment(memberFormDetails.birthDate.gregorian).format('YYYY-MM-DD');
    if (nationality.english === NationalityTypeEnum.SAUDI_NATIONAL) {
      const id = memberFormDetails.newNin;
      const personType = NationalityCategoryEnum.SAUDI_PERSON;
      this.memberService.verifyMember(id, birthDate, nationality.english, personType).subscribe(
        res => {
          if (res.recordCount > 0) {
            this.mapValue(res?.listOfPersons[0]);
          } else {
            this.alertService.showError(this.errMessage);
          }
        },
        err => {
          this.showError(err);
        }
      );
    } else if (MBConstants.GCC_NATIONAL.indexOf(nationality.english) !== -1) {
      const id = memberFormDetails.id;
      const personType = NationalityCategoryEnum.GCC_PERSON;
      this.memberService.verifyMember(id, birthDate, nationality.english, personType).subscribe(
        res => {
          if (res?.recordCount > 0) {
            if(!res?.listOfPersons[0].birthDate){
              this.personBirthDate = memberFormDetails.birthDate;
            }
            this.mapValue(res?.listOfPersons[0]);
          } else {
            memberFormDetails.identity = [];
            if(!res?.listOfPersons[0].birthDate){
              this.personBirthDate = memberFormDetails.birthDate;
            }
            this.bindIdentity(memberFormDetails);
            this.mapValue(this.member);
          }
        },
        err => {
          this.showError(err);
        }
      );
    } else {
      const id = memberFormDetails.iqamaNo;
      const personType = NationalityCategoryEnum.NON_SAUDI;
      this.memberService.verifyMember(id, birthDate, nationality.english, personType).subscribe(
        res => {
          if (res?.recordCount > 0) {
            this.mapValue(res?.listOfPersons[0]);
          } else {
            memberFormDetails.identity = [];
            this.bindIdentity(memberFormDetails);
            this.mapValue(this.member);
          }
        },
        err => {
          this.showError(err);
        }
      );
    }
    this.modalRef.hide();
  }
  bindIdentity(memberFormDetails) {
    if (memberFormDetails.id && memberFormDetails.id !== '') {
      const nationalId: NationalId = new NationalId();
      nationalId.id = Number(memberFormDetails.id);
      memberFormDetails.identity.push(nationalId);
    }
    if (memberFormDetails.passportNo && memberFormDetails.passportNo !== '') {
      const passport: Passport = new Passport();
      passport.passportNo = memberFormDetails.passportNo;
      if (memberFormDetails.issueDate && memberFormDetails.expiryDate) {
        passport.issueDate = memberFormDetails.issueDate;
        passport.expiryDate = memberFormDetails.expiryDate;
      }
      memberFormDetails.identity.push(passport);
    }
    if (memberFormDetails.iqamaNo && memberFormDetails.iqamaNo !== '') {
      const iqama: Iqama = new Iqama();
      iqama.iqamaNo = memberFormDetails.iqamaNo;
      if (memberFormDetails.expiryDate) {
        iqama.expiryDate = memberFormDetails.expiryDate;
        iqama.expiryDate.gregorian = startOfDay(memberFormDetails.expiryDate.gregorian);
      }
      memberFormDetails.identity.push(iqama);
    }
    this.member = this.memberService.updateAdminDetails(this.member, memberFormDetails);
  }

  mapValue(res) {
    this.member = res;
    if (this.member?.identity) {
      this.verified = true;
      this.mbwizardItems[0].isActive = true;
      this.mbwizardItems[0].isDisabled = false;
      this.hasInitialised = true;
    }
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    if (this.routerDataToken.state) {
      if (
        this.editMode &&
        (this.routerDataToken.state === 'REASSIGNED' ||
          this.routerDataToken.state === 'ASSIGNED' ||
          this.routerDataToken.state === 'RETURN')
      ) {
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      }
    } else if (this.editMode) {
      this.router.navigate([RouterConstantsBase.ROUTE_TRANSACTION_HISTORY]);
    }
  }
  resetVerify(verify: boolean) {
    this.verified = verify;
    this.currentTab = 0;
    this.restrictProgress(this.currentTab, this.mbwizardItems);
    this.hasInitialised = false;
  }
  savememberFormDetails(memberFormDetails) {
    const status = 1;
    this.memberService
      .saveMemberDetails(memberFormDetails, status)
      .pipe(
        tap(res => {
          if (res) {
            this.member.mbProfessionalId = res?.mbProfessionalId;
            this.member.contactDetail = memberFormDetails.contactDetail;
          }
          if (res && res.contractId && !this.editMode) {
            this.hasperson = true;
            this.member.govtEmployee = res.govtEmployee;
            this.member.contractId = res.contractId;
            this.member.contractType = res.contractType;
            this.member.hospital = res.hospital;
            this.member.medicalBoardType = res.medicalBoardType;
            this.member.region = res.region;
            this.member.specialty = res.specialty;
            this.member.subSpecialty = res.subSpecialty;
            this.member.feesPerVisit = res.feesPerVisit;
            this.member.fees = res.fees;
          }
          this.nextForm();
        }),
        delay(100),
        tap(() => {
          this.isSaved = true;
        }),
        catchError(err => {
          super.showError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  restrictProgress(index: number, mbwizardItems: WizardItem[]) {
    for (let i = index; i < mbwizardItems.length; i++) {
      if (mbwizardItems[i]) {
        mbwizardItems[i].isDisabled = true;
        mbwizardItems[i].isActive = false;
        mbwizardItems[i].isDone = false;
      }
    }
  }

  /**
   * Display Next Form
   */
  nextForm() {
    scrollToTop();
    this.currentTab++;
    this.alertService.clearAlerts();
    if (this.currentTab < this.totalTabs) {
      this.addMemberTabs.tabs[this.currentTab].active = true;
    }
    if (this.addMemberWizard) {
      this.addMemberWizard.setNextItem(this.currentTab);
    }
  }

  saveContractDetails(memberFormDetails) {
    memberFormDetails.isReturn = false; //As asked by BE, passing isReturn as false when the API is called from contract page
    // Defect -537109 As asked by BE, passing isReturn as true for Returned Transaction
    if (this.routerDataToken.state === 'RETURN') {
      memberFormDetails.isReturn = true;
    }
    let status = 2;
    memberFormDetails.isSubmit = false; //As asked by BE, passing isSubmit as false when the API is called from contract page
    if (memberFormDetails.contractId) {
      status = 3;
    }
    this.memberService
      .saveMemberDetails(memberFormDetails, status)
      ?.pipe(
        tap(res => {
          if (res.contractId) {
            this.member.contractId = res?.contractId;
            this.member.transactionTraceId = res?.transactionTraceId;
          }
          if (this.member.contractId) {
            this.documentList$ = this.getDocumentList();
          }
          this.nextForm();
        }),
        delay(100),
        tap(() => {
          this.isSaved = true;
        })
      )
      .subscribe(noop, err => {
        this.showError(err);
      });
    if (this.member.contractId) {
      this.documentList$ = this.getDocumentList();
    }
  }

  /**
   * Method to get document list
   */
  getDocumentList(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        DocumentTransactionId.MTN_MB_DOCTOR,
        DocumentTransactionType.MEDICAL_BOARD,
        this.member.contractId,
        this.member.transactionTraceId
      )
      .pipe(tap(docs => (this.documentList = docs)));
  }

  /**
   * submit document
   */
  submitDocument = memberFormDetails => {
    const status = 3;
    this.member = memberFormDetails;
    this.member.isSubmit = true; //As asked by BE, passing isSubmit as true when the API is called from doc page
    this.alertService.clearAlerts();
    const submitDocumentList: DocumentSubmitItem[] = [];
    let isDocumentsValid = true;
    if (this.documentList?.length > 0) {
      for (const documentItem of this.documentList) {
        const submitItem: DocumentSubmitItem = new DocumentSubmitItem();
        if (
          documentItem.required &&
          (documentItem.documentContent === null || documentItem.documentContent === 'NULL')
        ) {
          documentItem.uploadFailed = true;
          isDocumentsValid = false;
        } else {
          documentItem.uploadFailed = false;
        }

        if (documentItem.documentContent && isDocumentsValid) {
          submitItem.contentId = documentItem.contentId;
          submitItem.type = documentItem.name;
          submitDocumentList.push(submitItem);
        }
      }
    }

    if (isDocumentsValid) {
      //TODO Remove console logs.Run and fix 'ng lint features-medical-board' before commiting
      this.member.scanDocuments = submitDocumentList;
      this.member.scanDocuments = [];
      if (this.editMode && this.routerDataToken.state === 'RETURN') {
        //  As asked by BE, this section of updateBpmTask is commented since there is a 500 issue while submitting the draft. 
        //  Defect 542849
          this.updateBpmTask.outcome = WorkFlowActions.UPDATE;
          this.updateBpmTask.comments = memberFormDetails?.commentsDto;
          this.workflowService.updateTaskWorkflow(this.updateBpmTask).subscribe(
            () => {
              // As asked by BE, submit API also called along with update API since value needs to be updated in MB DB.
              this.memberService.saveMemberDetails(this.member, status).subscribe(
                res => {
                  if (res.transactionTraceId) {
                    this.mbService.feedBackMessage = MBConstants.ADD_MEMBER_FEEDBACK_MESSAGE(res.transactionTraceId);
                    this.addAnotherMember();
                  }
                },
                err => {
                  this.showError(err);
                }
              );
              // this.mbService.feedBackMessage = MBConstants.ADD_MEMBER_FEEDBACK_MESSAGE(this.member.transactionTraceId);
              // this.addAnotherMember();
            },
            err => {
              this.alertService.showError(err.error.message);
            }
          );
        } else {
        this.memberService.saveMemberDetails(this.member, status).subscribe(
          res => {
            if (res.transactionTraceId) {
              this.mbService.feedBackMessage = MBConstants.ADD_MEMBER_FEEDBACK_MESSAGE(res.transactionTraceId);
              this.addAnotherMember();
            }
          },
          err => {
            this.showError(err);
          }
        );
      }
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  };

  refreshDocument(document: DocumentItem) {
    this.documentService.refreshDocument(document, this.member.contractId).subscribe(res => (document = res));
  }

  ngOnDestroy(): void {
    this.alertService.clearAllErrorAlerts();
  }

  /**
   * This method is to navigate to previous tab
   */
  previousForm() {
    this.alertService.clearAlerts();
    this.currentTab--;
    if (this.mbwizardItems && this.mbwizardItems.length > 0) {
      if (this.addMemberWizard) {
        this.addMemberWizard.setPreviousItem(this.currentTab);
      }
    }
    scrollToTop();
  }

  /**
   * This method is to navigate to list page
   */
  addAnotherMember() {
    this.router.navigate([MbRouteConstants.ROUTE_LIST_MEDICAL_MEMBERS]);
    // this.router.navigate(['/home/medical-board/add-members/refresh']);
  }

  /** This method is used to show given template   */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  showReturnTemplate(templateParam) {
    this.alertService.clearAlerts();
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(templateParam, config);
  }
  cancelForm() {
    this.alertService.clearAlerts();
    this.hideModal();
    if (!this.editMode) {
      this.router.navigate([MbRouteConstants.ROUTE_LIST_MEDICAL_MEMBERS]);
    } else {
      if (
        this.routerDataToken.state &&
        (this.routerDataToken.state === 'REASSIGNED' ||
          this.routerDataToken.state === 'ASSIGNED' ||
          this.routerDataToken.state === 'RETURN')
      ) {
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      } else {
        this.router.navigate([RouterConstantsBase.ROUTE_TRANSACTION_HISTORY]);
      }
    }
    catchError(err => {
      this.alertService.showError(err?.error?.message, err?.error?.message);
      return of(null);
    });
  }
}
