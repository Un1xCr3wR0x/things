import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DropDownItems } from '@gosi-ui/features/contributor';
import { AlertService, BilingualText, RoleIdEnum, RouterConstants } from '@gosi-ui/core';
import { MBConstants } from '../../../shared/constants';
import { MedicalBoardService } from '../../../shared/services';

@Component({
  selector: 'mb-medical-board-session-sc',
  templateUrl: './medical-board-session-sc.component.html',
  styleUrls: ['./medical-board-session-sc.component.scss']
})
export class MedicalBoardSessionScComponent implements OnInit, OnDestroy {
  medicalBoardTabs = [];
  medicalTab = MBConstants.SCHEDULED_SESSION;
  url: string;
  previousUrl: string = null;
  currentUrl: string = null;
  isSessionRequired: boolean;
  actionDropDown: DropDownItems[];
  cancelError: BilingualText;
  createSession = [RoleIdEnum.MS_OFFICER, RoleIdEnum.BOARD_OFFICER, RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER];

  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly medicalBoardService: MedicalBoardService
  ) {}

  ngOnInit(): void {
    this.alertService.clearAllErrorAlerts();
    this.actionDropDown = new Array<DropDownItems>();
    this.actionDropDown.push(
      { id: 1, key: 'MEDICAL-BOARD.CREATE-REGULAR-SESSION' },
      { id: 2, key: 'MEDICAL-BOARD.CREATE-ADHOC-SESSION' }
    );
    this.getAccountTabsetDetails();
    this.medicalTab = MBConstants.SCHEDULED_SESSION;
    const previousSessionUrl = this.medicalBoardService.getPreviousUrl();
    if (
      previousSessionUrl !== null &&
      previousSessionUrl !== undefined &&
      previousSessionUrl?.indexOf('/session-details') !== -1
    )
      this.medicalTab = MBConstants.SESSION_CONFIGURATIONS;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        if (this.previousUrl?.indexOf('/session-details') !== -1)
          this.medicalBoardService.setPreviousUrl(this.previousUrl);
      }
    });
    if (this.medicalBoardService.getCancelError()) {
      this.cancelError = this.medicalBoardService.getCancelError();
    }
  }
  getAccountTabsetDetails() {
    this.medicalBoardTabs = [];
    this.medicalBoardTabs.push({
      tabName: MBConstants.SCHEDULED_SESSION
    });
    this.medicalBoardTabs.push({
      tabName: MBConstants.SESSION_CONFIGURATIONS
    });
  }
  onMedicalBoardToNewTab(accountTabs: string) {
    this.medicalTab = accountTabs;
  }

  /**
   * Method to navigate to create session page
   * @param id
   */
  navigateToCreateSession(id: number) {
    if (id === 1) {
      this.router.navigate([MBConstants.ROUTE_SESSION_DETAILS]);
    } else {
      this.router.navigate([MBConstants.ROUTE_ADHOC_SESSION_DETAILS]);
    }
  }

  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAlerts();
  }

  onBack(){
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
}
