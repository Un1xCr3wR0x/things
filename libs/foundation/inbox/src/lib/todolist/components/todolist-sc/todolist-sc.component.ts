/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  AuthTokenService,
  Environment,
  EnvironmentToken,
  IdentityManagementService,
  LanguageToken,
  RouterService,
  TransactionService,
  WorkflowService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { InboxBaseScComponent } from '../../../shared';

@Component({
  selector: 'ibx-todolist-sc',
  templateUrl: './todolist-sc.component.html',
  styleUrls: ['./todolist-sc.component.scss']
})
export class TodolistScComponent extends InboxBaseScComponent implements OnInit, OnDestroy {
  control = new FormControl(null, Validators.required);
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly authTokenService: AuthTokenService,
    readonly alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly fb: FormBuilder,
    readonly workflowService: WorkflowService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly routerService: RouterService,
    readonly router: Router,
    readonly identityManagementService: IdentityManagementService
  ) {
    super(
      alertService,
      routerService,
      router,
      language,
      fb,
      appToken,
      workflowService,
      authTokenService,
      environment,
      transactionService,
      identityManagementService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    super.getRequest();
  }
  refreshTab(event) {
    super.getRequest();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  onSearch(searchKey: string) {
    this.searchTransactions(searchKey);
  }
}
