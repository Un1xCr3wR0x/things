/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Router} from '@angular/router';
import {
  AddressDetails,
  AuthTokenService,
  Establishment,
  EstablishmentStatusEnum,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber,
  RoleIdEnum
} from '@gosi-ui/core';
import {DropDownItems} from '@gosi-ui/features/contributor';
import {BehaviorSubject} from 'rxjs';
import {DashboardConstants} from '../../constants';
import {EstablishmentList} from '../../models';
import {Admin, AdminRoleEnum, EstablishmentService, getAdminRole} from "@gosi-ui/features/establishment";


@Component({
  selector: 'dsb-establishment-branch-card-dc',
  templateUrl: './establishment-branch-card-dc.component.html',
  styleUrls: ['./establishment-branch-card-dc.component.scss']
})
export class EstablishmentBranchCardDcComponent implements OnInit, OnChanges {
  //local variables
  isNavigate = true;
  address: AddressDetails = null;
  totalEngagements: number;
  minHeight = DashboardConstants.BRANCH_CARD_MIN_HEIGHT;
  showCertificate = false;
  isCloseIcon = false;
  hide: boolean = true;
  actionDropDown: DropDownItems[];
  lang = 'en';
  setOfTwo: boolean = false;
  establishment : Establishment;
  superAdminRole : RoleIdEnum;
  admins: Admin[] = [];
  superAdmin: Admin;
  loggedInAdminRole: string;
  loggedInAdminRoleId: number;
  showOnlyRoleAdmins = false;




  //input variables
  @Input() list: EstablishmentList = null;
  @Input() width: number;
  @Input() txnPending: number;
  @Input() certificateRequired: boolean;
  @Input() isShowCES;
  @Input() isSuperAdmin :boolean;
  //output variables
  @Output() new: EventEmitter<null> = new EventEmitter();
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  @Output() navigateHealthInsurance: EventEmitter<null> = new EventEmitter();
  @Output() navigateComplaints: EventEmitter<null> = new EventEmitter();
  @Output() navigateTo: EventEmitter<null> = new EventEmitter();
  @Output() view: EventEmitter<null> = new EventEmitter();
  @Output() favorite: EventEmitter<null> = new EventEmitter();
  constructor(
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly authTokenService: AuthTokenService,
    readonly authService: AuthTokenService,
    readonly establishmentService: EstablishmentService,


  ) {
    this.superAdminRole = RoleIdEnum.SUPER_ADMIN;
  }
  @HostListener('window:resize', ['$event'])
  onWIndowREsize() {
    this.width = window.innerWidth;
    if (this.width > 800 && this.width < 1115) {
      this.setOfTwo = true;
    } else {
      this.setOfTwo = false;
    }
  }

  /**
   * method to initialise tasks
   */
  ngOnInit(): void {


    this.language.subscribe(language => {
      this.lang = language;
    });
    this.onWIndowREsize();
    this.actionDropDown = new Array<DropDownItems>();
    this.actionDropDown.push(
      {
        id: 1,
        value: { english: 'Raise Complaint/Suggestion/Enquiry', arabic: ' تقديم شكوى / اقتراح / استفسار' },
        url: 'assets/images/Complaint1.svg'
      },
      { id: 2, value: { english: 'Raise Appeal', arabic: 'تقديم اعتراض' }, url: 'assets/images/Appeal.svg' },
      { id: 3, value: { english: 'Raise Plea', arabic: 'تقديم استئناف' }, url: 'assets/images/Plea.svg' }
    );
    //  { id: 4, value: { english: 'Close Establishment',
    //  arabic: 'إعادة تعيين إلى بريد المنشأة' }, url: 'assets/images/Close.svg' });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes && changes?.list?.currentValue) {
        this.list = changes.list.currentValue;
        if (this.list && this.list?.status) {
          if (
            this.list?.status?.english === EstablishmentStatusEnum.CANCELLED ||
            this.list?.status?.english === EstablishmentStatusEnum.CLOSED ||
            this.list?.status?.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS
          )
            this.isCloseIcon = true;
          else this.isCloseIcon = false;
        }
      }
      if (this.list && this.list?.contactDetails?.addresses) {
        this.address = this.getAddress(this.list.contactDetails.currentMailingAddress);
      }
      if (this.list && this.list?.name) {
        if (this.list.name.english === null) {
          this.list.name.english = this.list.name.arabic;
        }
      }
      if (
        this.list &&
        (this.list?.engagementInfo?.totalNonSaudiCount || this.list?.engagementInfo?.totalNonSaudiCount)
      ) {
        this.totalEngagements =
          this.list?.engagementInfo?.totalNonSaudiCount + this.list?.engagementInfo?.totalNonSaudiCount;
      }
    }
  }
  /**
   * method to emit add event
   */
  addNewEvent() {
    this.new.emit();
  }
  /**
   *
   * @param registrationNo method to emit navigation event
   */
  navigateToBranch() {
    if (this.isNavigate == true) {
      this.navigate.emit();
    }
  }
  navigateToHealthInsurance() {
    if (this.isNavigate === true) {
      this.navigateHealthInsurance.emit();
    }
  }
  navigateToComplaints(event) {
    this.isNavigate = false;
    if (event == '2') {
      const lan: any = this.lang + '_US';
      window.open('https://www.gosi.gov.sa/GOSIOnline/File_an_Appeal?locale=' + lan);
    } else if (event == '3') {
      const lan: any = this.lang + '_US';
      window.open('https://www.gosi.gov.sa/GOSIOnline/File_a_Plea?locale=' + lan);
    } else {
      this.navigateComplaints.emit();
    }
  }
  /**
   *
   * navigate to billin view
   */
  navigateToBillingView() {
    this.view.emit();
  }
  /**
   *
   * @param registrationNo method to emit navigation event
   */
  navigateToCertificateView() {
    this.navigateTo.emit();
  }
  /**
   * Method to get the particular address from array
   * @param type
   */
  getAddress(type): AddressDetails {
    {
      return this.list?.contactDetails?.addresses.find(address => address.type === type);
    }
  }
  addRemoveEstablishmentFromFavorite(){
    this.favorite.emit();
  }
  checkRoles(loggedInAdminRole: string) {
    if ( loggedInAdminRole === AdminRoleEnum.SUPER_ADMIN) {
      this.showOnlyRoleAdmins = true;
    } else this.showOnlyRoleAdmins = false;
  }




}
