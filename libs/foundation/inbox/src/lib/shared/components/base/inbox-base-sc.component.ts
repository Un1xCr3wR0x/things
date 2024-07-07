/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  BPMTaskListBaseComponent,
  Environment,
  EnvironmentToken,
  IdentityManagementService,
  LanguageToken,
  RequestSort,
  Role,
  RouterService,
  TaskCountResponse,
  TransactionService,
  WorkflowService
} from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Directive()
export abstract class InboxBaseScComponent extends BPMTaskListBaseComponent implements OnInit, OnDestroy {
  /**
   * Local Varibles
   */
  totalCount = 0;
  differenceHours: number;
  goToPage = 1;
  pageSize = 10;
  lang = '';
  taskResponse: TaskCountResponse;
  sortItem: RequestSort = new RequestSort();

  userName: BilingualText; //TODO Remove this variable and use user name from auth token directly
  userId: string; //TODO Remove this variable once apigee and bpm are integrated for getting userId from token
  @ViewChild('componentChild') paginationDcComponent: PaginationDcComponent;
  /**
   *
   * @param inboxService
   * @param routerService
   * @param router
   * @param language
   * @param fb
   * @param appToken
   */
  constructor(
    readonly alertService: AlertService,
    readonly routerService: RouterService,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly workflowService: WorkflowService,
    readonly authTokenService: AuthTokenService, //TODO Remove once api changes are done
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly identityManagementService: IdentityManagementService
  ) {
    super(workflowService, environment, transactionService, routerService, authTokenService);
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.isWorkList = this.isValidator = this.appToken === ApplicationTypeEnum.PRIVATE;
    const token: JwtPayload = jwtDecode<JwtPayload>(this.authTokenService.getAuthToken());
    this.userId = token.sub || Role.EST_ADMIN;
    this.userName = { english: token['longnameenglish'], arabic: token['longnamearabic'] }; //TODO add these keys in the Token Model]
    // TODO: KP remove below line on merging to master
    //this.currentValidator = 'Shabin';
    this.alertService.getAlerts().subscribe(alerts => {
      if(alerts.length > 0) {
        this.currentGoToPage = true;
      } else {
        this.currentGoToPage = false;
      }
    });
  }
  /**
   * method to update total count
   * @param event
   */
  updateTotal(event) {
    this.totalCount = event;
  }
  /**
   * method to get current validator
   */
  getList(value: string) {
    this.currentValidator = value;
    this.getRequest();
    this.getPerformance(this.selectedDay);
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
}
