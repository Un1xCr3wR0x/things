/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  BaseComponent,
  convertToYYYYMMDD,
  GosiCalendar,
  LookupService,
  LovList,
  startOfDay
} from '@gosi-ui/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigurationFilterConstants } from '../../constants';
import { GeneralEnum } from '../../enums';
import {
  AddMemberRequest,
  ConfigurationList,
  ConfigurationWrapper,
  ContractedMembers,
  IndividualSessionDetails,
  SessionRequest,
  SessionStatusDetails,
  DropDownItems
} from '../../models';
import { SessionConfigurationService, SessionStatusService } from '../../services';
@Directive()
export class ConfigurationBaseScComponent extends BaseComponent implements OnInit {
  /**
   * Local variables
   */
  dateSession: string;
  currentDate = startOfDay(new Date());
  canHide: boolean;
  addMemberRequest: AddMemberRequest[] = [];
  configurationId: number;
  contractedMembers: ContractedMembers[] = [];
  disabled = false;
  sessionStatusDetails: SessionStatusDetails = new SessionStatusDetails();
  individualSessionDetails: IndividualSessionDetails = new IndividualSessionDetails();
  isAmpOffice: boolean;
  isRegular: boolean;
  sessionDropDown: DropDownItems[];
  sessionId: number;
  sessionRequest: SessionRequest = new SessionRequest();
  sessionResponse: ConfigurationList[];
  sessionType: string;
  specialityList: LovList;
  stopDate: GosiCalendar = new GosiCalendar();
  stopReasonList$: Observable<LovList>;
  templateId: number;
  totalCount: number;

  /**Observables */
  fieldOfficeLists$: Observable<LovList>;
  medicalBoardTypeLists$: Observable<LovList>;
  channelLists$: Observable<LovList>;
  statusLists$: Observable<LovList>;
  holdReasonList$: Observable<LovList>;
  mbLocationList$: Observable<LovList>;
  /**
   *
   * @param sessionStatusService
   * @param lookupService
   * @param activatedRoute
   * @param configurationService
   * @param alertService
   */
  constructor(
    readonly sessionStatusService: SessionStatusService,
    readonly lookupService: LookupService,
    readonly activatedRoute: ActivatedRoute,
    readonly configurationService: SessionConfigurationService,
    readonly alertService: AlertService
  ) {
    super();
  }

  ngOnInit(): void {}
  /**
   * Method to get field office list
   */
  initializeView(): void {
    this.getSpecialityList();
    this.activatedRoute?.queryParams?.subscribe(res => {
      this.sessionType = res.sessionType;
      if (
        this.sessionType ===
        (ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[1]?.value?.english).replace(/\s/g, '')
      ) {
        this.isRegular = false;
        this.sessionId = Number(res.sessionId);
        this.configurationId = this.sessionId;
      } else if (
        this.sessionType ===
        (ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[0]?.value?.english).replace(/\s/g, '')
      ) {
        this.isRegular = true;
        this.templateId = Number(res.templateId);
        this.configurationId = this.templateId;
      }
      this.getIndividualSessionDetails(this.configurationId);
    });
  }
  /**
   * Method to get individual session configuration details
   * @param configurationId
   */
  getIndividualSessionDetails(configurationId: number) {
    this.configurationService
      .getIndividualSessionDetails(configurationId, this.sessionType)
      .pipe(
        tap(res => {
          this.individualSessionDetails = res;
          this.stopDate = res.startDate;
          this.isAmpOffice = res.fieldOfficeCode === 0 ? true : false;
          if (
            this.individualSessionDetails.sessionType.english ===
            (ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[1]?.value?.english).replace(/\s/g, '')
          ) {
            this.isRegular = false;          
          } else if (
            this.individualSessionDetails.sessionType.english ===
            (ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[0]?.value?.english).replace(/\s/g, '')
          ) {
            this.isRegular = true;          
          }
          if(!this.isRegular){
            this.initializeTheViewDetails();
          }        
          const medicalBoardType = res.medicalBoardType;
          const isAmbUser = res.isAmbUser;
          if (this.individualSessionDetails.status?.english === 'Stopped') this.disabled = true;
          else {
            if (this.isAmpOffice && medicalBoardType?.english === GeneralEnum.AMB && isAmbUser) this.disabled = false;
            else if (!this.isAmpOffice && medicalBoardType?.english === GeneralEnum.PMB && !isAmbUser)
              this.disabled = false;
            else this.disabled = true;
          }
        }),
        catchError(err => {
          this.handleErrors(err);
          return throwError(err);
        })
      )
      .subscribe();
  }
  initializeTheViewDetails() {
    const dateSession = convertToYYYYMMDD(this.individualSessionDetails?.startDate?.gregorian.toString());
    const currentDate = convertToYYYYMMDD(new Date().toString());
    this.getTimeDateComparison(dateSession, currentDate);
  }
  getTimeDateComparison(dateSession, todayDate) {
    this.canHide = false;
    if (dateSession < todayDate) {
      this.canHide = true;
    } else if (dateSession === todayDate) {
      const hours = new Date().getHours();
      let _min = new Date().getMinutes().toString();      
      _min = _min.length === 1 ? '0' + _min.toString() : _min;     
     // hours = ((hours + 11) % 12 + 1);           
      const strTime = hours.toString() + ':' + _min;
      const endTime =   this.individualSessionDetails.endTime.split(' ');
      let endHourMin = endTime[0].split(':');
      let endHour = Number(endHourMin[0]);
      let endMin=0;
      if(endHourMin.length === 3){
        endMin = Number(endHourMin[2]);
      }else{
        endMin = Number(endHourMin[1]);
      }
      
      if(endTime[1] === "PM" && endHour < 12) endHour = endHour + 12;
      if(endTime[1] === "AM" && endHour === 12) endHour = endHour - 12;
      let sHours = endHour.toString();
      let sMinutes = endMin.toString();
      if(endHour<10) sHours = "0" + sHours;
      if(endMin<10) sMinutes = "0" + sMinutes;
      const sessionEndTime = sHours+":"+sMinutes;     
      dateSession = dateSession+' '+sessionEndTime;
      todayDate = todayDate+ ' '+strTime;
      if(new Date(Date.parse(todayDate)) > new Date(Date.parse(dateSession))){
        this.canHide = true;  
      } 
    }
  }
  /**
   * Method to get office location list
   */
  getOfficeList() {
    this.fieldOfficeLists$ = this.lookupService.getMbLocations().pipe(
      map((list: LovList) => {
        if (list) {
          list.items.forEach(item => {
            item.value.arabic = item.value?.arabic.trim();
            item.value.english = item.value?.english.trim();
          });
          return list;
        }
      })
    );
  }
  /**
   * Method to get session type list
   */
  getSessionType() {
    this.medicalBoardTypeLists$ = this.lookupService.getMedicalBoardTypeList();
  }
  /**
   *  method to get channel
   */
  getSessionChannel() {
    this.channelLists$ = this.lookupService.getSessionChannel();
  }

  getSessionStatus() {
    this.statusLists$ = this.lookupService.getSessionStatus();
  }
  /**
   * Method to show error
   * @param errors
   */
  handleErrors(errors): void {
    if (errors && errors?.error) this.alertService.showError(errors.error?.message);
  }
  /**
   * Method to getSpecialityList
   */
  getSpecialityList() {
    this.lookupService.getSpecialityList().subscribe(res => {
      if (res) this.specialityList = res;
    });
  }
  /**
   * Method to get session records
   */
  getSessionRecords(sortQueryParam) {
    this.configurationService.getConfigurationList(this.sessionRequest, sortQueryParam).subscribe(
      (sessionResponse: ConfigurationWrapper) => {
        this.totalCount = sessionResponse.totalCount;
        this.sessionResponse = sessionResponse.summaryDetails;
      },
      error => {
        this.alertService.showError(error?.error?.message);
      }
    );
  }
  getStopReasonList() {
    this.stopReasonList$ = this.lookupService.getStopReasonsList();
  }
  getHoldReasonList() {
    this.holdReasonList$ = this.lookupService.getHoldCreationList();
  }
}
