/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  AuthTokenService,
  BilingualText,
  LanguageToken,
  LookupService,
  LovList,
  MenuService,
  RoleIdEnum
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  AddParticipantsList,
  AvailableSession,
  BulkParticipants,
  MBConstants,
  MedicalBoardService,
  ParticipantsDetails,
  SessionRequest,
  SessionStatusService
} from '../../../shared';
import { ParticipantQueueService } from '../../../shared/services/participant-queue.service';
import { ParticipantSpeciality } from '../../../shared/models/participant-speciality';
import { Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';

@Component({
  selector: 'mb-assign-session-sc',
  templateUrl: './assign-session-sc.component.html',
  styleUrls: ['./assign-session-sc.component.scss']
})
export class AssignSessionScComponent implements OnInit, OnDestroy {
  /**
   * Local variables
   */
  participantsInQueue: ParticipantsDetails;
  selectedBox: AvailableSession;
  participantsInQueuedata;
  bulkParticipants: BulkParticipants[] = [];
  selectParticipants: AddParticipantsList[] = [];
  availableSessionInfoBySpeciality: AvailableSession;
  responseData;
  participantForm: FormGroup = new FormGroup({});
  locationList$: Observable<LovList>;
  lang = 'en';
  locationList: LovList = new LovList([
    { value: { english: 'All location', arabic: 'كل الموقع' }, sequence: 0, code: -1 }
  ]);
  locationValues: BilingualText[] = [];
  sessionRequest: SessionRequest = new SessionRequest();
  participantSpecialitydata;
  participantSpeciality: ParticipantSpeciality = new ParticipantSpeciality();
  specialityCountsEn: { [key: string]: number } = {};
  specialityCountsAR: { [key: string]: number } = {};
  specialityArray: BilingualText[] = [];
  modalRef: BsModalRef;
  sessionDetails = [];
  itemsPerPage = 10;
  paginationId = 'paginationId';
  noOfRecords = 0;
  currentPage = 1;
  isEnoughSlots = true;
  isDifferent = false;
  selectedhighlight = false;
  isCheckage = false;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  locationData: any;
  location = '';
  selectedSpeciality;
  specialityWarning = {
    english:
      'The Medical Board does not contain the Specialty required for the contributor to be added, press OK if you wish to continue',
    arabic: 'اللجنة الطبية لا تحتوي على التخصص المطلوب للمشترك المراد اضافته ، اضغط موافق في حال رغبتك في الاستمرار'
  };
  isAppeal = false;
  availableSlot: number;
  pCount = 0;
  showAvailbalePart: boolean;
  headOffice = { value: { english: 'Head office', arabic: 'المركز الرئيسي ' }, sequence: 1, code: 1000 };
  patchedLocation = false;
  selectedSessionIndex: number;
  /**
   *
   * @param fb
   * @param lookupService
   * @param alertService
   * @param language
   */
  constructor(
    readonly fb: FormBuilder,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly sessionStatusService: SessionStatusService,
    readonly medicalBoardService: MedicalBoardService,
    readonly router: Router,
    readonly locations: Location,
    readonly participantQueueService: ParticipantQueueService,
    readonly authTokenService: AuthTokenService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly menuService: MenuService
  ) {}
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    // this.medicalBoardService.participantInQueue$.subscribe(data => {
    //   this.participantsInQueuedata = data;
    //   this.participantsInQueue = this.participantsInQueuedata;
    //   this.selectedBox = this.participantsInQueuedata?.availableSessionInfoBySpeciality;
    // });
    this.getLocationList();
    this.noOfRecords = this.sessionDetails.length;
    this.language.subscribe(lang => (this.lang = lang));
    this.participantForm = this.createParticipantForm();
    this.bulkParticipants = history?.state?.statedata?.bulkParticipants;
    this.selectParticipants = history?.state?.adhocdata?.participantSpeciality;
    this.location = this.menuService.getLocation();
    this.medicalBoardService.participant$.subscribe(data => {
      this.participantSpecialitydata = data;
      this.participantSpeciality = this.participantSpecialitydata;
      if (this.participantSpeciality) {
        this.location === '0' ? this.setHeadOfficeLocation() : this.setApiLocation();
      }
      this.routeBackSpeciality();
      this.participantSpeciality?.primarySpeciality.forEach(specialty => {
        this.specialityCountsEn[specialty.english] = (this.specialityCountsEn[specialty.english] || 0) + 1;
        this.specialityCountsAR[specialty.arabic] = (this.specialityCountsEn[specialty.arabic] || 0) + 1;
      });
    });
  }
  setHeadOfficeLocation() {
    this.participantForm.get('location').get('english').patchValue('Head office');
    this.participantForm.get('location').get('arabic').patchValue('المركز الرئيسي ');
    this.locationList = new LovList([this.headOffice]);
    this.selectCountry(this.headOffice.value); // get session List
    this.patchedLocation = true;
  }
  setApiLocation() {
    this.locationList$.subscribe(val => {
      if (val) {
        const matchingIndex = val.items.findIndex(item => item?.code.toString() === this.location);
        this.participantForm.get('location').get('english').patchValue(val.items[matchingIndex].value.english);
        this.participantForm.get('location').get('arabic').patchValue(val.items[matchingIndex].value.arabic);
        this.selectCountry(val.items[matchingIndex].value); // get  session List
        this.patchedLocation = true;
      }
    });
    this.locationList$.subscribe(data => (this.locationList = data));
  }
  // setInitialLocation() {
  //   this.location = this.menuService.getLocation();
  //   const headOffice = { value: { english: 'Head office', arabic: 'المركز الرئيسي ' }, sequence: 1 };
  //   if (this.location === '0') {
  //     this.participantForm.get('location').patchValue(headOffice.value);
  //     this.locationList = new LovList([headOffice]);
  //     this.selectCountry(headOffice.value);
  //   } else {
  //     this.locationList$.subscribe(res => {
  //       if (res && res?.items) {
  //         const userLocation = res.items.find(item => item.code.toString() === this.location).value;
  //         this.participantForm.get('location').patchValue(userLocation);
  //         this.selectCountry(userLocation);
  //       }
  //     });
  //   }
  // }
  /**
   * Method to create participant form
   */
  createParticipantForm() {
    return this.fb.group({
      location: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  specialtyKeys(): string[] {
    return Object.keys(this.specialityCountsEn);
  }
  specialtyKeysAr(): string[] {
    return Object.keys(this.specialityCountsAR);
  }

  routeBackSpeciality() {
    this.specialityCountsAR = {};
    this.specialityCountsEn = {};
  }
  selectparticipant(available: AvailableSession) {
    this.isDifferent = false;
    this.showAvailbalePart = false;
    this.selectedBox = available;
    this.selectedhighlight = true;
    this.pCount = 0;
    this.availableSlot = 0;
    this.availableSlot = available?.maximumBeneficiaries - available?.filledBeneficiaries;

    this.selectedSessionIndex = this.participantsInQueue?.availableSessionInfoBySpeciality.findIndex(data => {
      data === available;
    });
    /**
     * To show warning message for different specility added in other speciality session
     */
    this.selectedSpeciality = available.listOfSpeciality;
    const existingdata = Object.keys(this.specialityCountsEn);
    existingdata.forEach(data => {
      this.pCount = this.pCount + this.specialityCountsEn[data];
    });
    if (this.pCount > this.availableSlot && available?.maximumBeneficiaries !== available?.filledBeneficiaries) {
      this.showAvailbalePart = true;
    }
    const specialities = [...this.selectedSpeciality.map(speciality => speciality?.english), ...existingdata];
    const uniqueSpecialities = new Set();
    specialities.forEach(speciality => uniqueSpecialities.add(speciality));
    if (specialities.length === uniqueSpecialities.size) {
      this.isDifferent = true;
    } else {
      this.isDifferent = false;
    }
  }
  getBoxClass(participant): string {
    return this.selectedBox === participant ? 'selected' : '';
  }
  showalert(available: AvailableSession): boolean {
    return available && available.filledBeneficiaries === available.maximumBeneficiaries;
  }
  /**
   * Method to get location list
   */
  getLocationList() {
    this.locationList$ = this.lookupService.getFieldOfficeList(true).pipe(
      map((list: LovList) => {
        if (list) {
          list.items.forEach(item => {
            item.value.arabic = item.value?.arabic?.trim();
            item.value.english = item.value?.english?.trim();
          });
          return list;
        }
      })
    );
    this.lookupService.getFieldOfficeList().subscribe(res => {
      this.locationList = { ...this.locationList, items: [...this.locationList.items, ...res.items] };
      if (res)
        res.items?.forEach(key => {
          this.locationValues.push(key.value);
        });
    });
  }
  getSessionAarabicTime(value) {
    if (this.lang === 'en') {
      return value;
    } else {
      if (value) {
        value = value?.replace(/AM/gi, 'ص');
        value = value?.replace(/PM/gi, 'م');
      }
      return value;
    }
  }
  /**
   * Method to get the selected page
   * @param page
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.currentPage = this.pageDetails.currentPage = page;
      this.participantSpeciality.pageNo = this.currentPage - 1;
      this.getparticipantSpeciality(this.participantSpeciality);
    }
  }
  selectCountry(value: BilingualText) {
    this.participantSpeciality.pageNo = this.currentPage - 1;
    this.participantSpeciality.pageSize = this.itemsPerPage;
    if (this.participantSpeciality) {
      this.participantSpeciality.location = [];
      this.locationData = value;
      if (this.locationData !== 'All location') {
        this.participantSpeciality?.location.push(value);
      }
      this.getparticipantSpeciality(this.participantSpeciality);
    }
  }
  /**
   * Method of cancel template
   */
  onTemplateOpen(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /**
   * Method to hide modal
   */
  decline() {
    this.modalRef.hide();
  }
  /**
   * method to confirm cancel
   */
  confirmCancel(data: number) {
    this.modalRef?.hide();
    this.alertService.clearAllWarningAlerts();
    if (data === 2) this.locations.back();
  }
  assignSession() {
    this.sessionStatusService.addBulkParticipants(this.selectedBox.sessionId, this.bulkParticipants).subscribe(
      () => {
        this.alertService.showSuccessByKey('MEDICAL-BOARD.ADD_PARTICIPANT_SUCCESSFULLY', null, 5);

        // this.participantsInQueue.availableSessionInfoBySpeciality.splice(this.selectedSessionIndex);
        this.locations.back();
      },
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
    this.modalRef?.hide();
  }
  getparticipantSpeciality(participantSpecialities) {
    this.participantQueueService.getAssignParticipantDetails(participantSpecialities).subscribe(
      response => {
        this.participantsInQueue = this.participantsInQueuedata = response;
        this.selectedBox = this.participantsInQueuedata?.availableSessionInfoBySpeciality;
        this.noOfRecords = this.participantsInQueue.count;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  ngOnDestroy() {
    this.selectedhighlight = false;
    this.alertService.clearAllWarningAlerts();
  }
  navigateToCreateSession() {
    const adhocdata = {
      participantSpeciality: this.selectParticipants
    };
    this.router.navigate([MBConstants.ROUTE_ADHOC_SESSION_DETAILS], { state: { adhocdata } });
  }
}
