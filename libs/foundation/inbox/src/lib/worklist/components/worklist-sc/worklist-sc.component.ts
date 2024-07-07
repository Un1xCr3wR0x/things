/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApplicationTypeToken,
  AuthTokenService,
  LanguageToken,
  RouterService,
  WorkflowService,
  AlertService,
  Environment,
  EnvironmentToken,
  TransactionService,
  IdentityManagementService,
  Environments
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { InboxBaseScComponent } from '../../../shared';

@Component({
  selector: 'ibx-worklist-sc',
  templateUrl: './worklist-sc.component.html',
  styleUrls: ['./worklist-sc.component.scss']
})
export class WorklistScComponent extends InboxBaseScComponent implements OnInit, OnDestroy {
  environments = Environments;
  constructor(
    readonly routerService: RouterService,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly fb: FormBuilder,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly authTokenService: AuthTokenService,
    readonly alertService: AlertService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
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
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
