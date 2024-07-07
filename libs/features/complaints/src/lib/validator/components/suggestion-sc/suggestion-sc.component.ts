/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, SimpleChanges } from '@angular/core';
import {
  LookupService,
  RouterService,
  ApplicationTypeToken,
  RouterDataToken,
  RouterData,
  WorkflowService,
  AlertService,
  UuidGeneratorService,
  DocumentService,
  MenuService,
  Environment,
  EnvironmentToken,
  TransactionService,
  AuthTokenService
} from '@gosi-ui/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorService, ValidatorRoutingService } from '../../../shared/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ValidatorBaseScComponent } from '../base/validator-base-sc.component';
import { PlatformLocation, Location } from '@angular/common';

@Component({
  selector: 'ces-suggestion-sc',
  templateUrl: './suggestion-sc.component.html',
  styleUrls: ['./suggestion-sc.component.scss']
})
export class SuggestionScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   *
   * @param modalService
   * @param validatorService
   * @param documentService
   * @param uuidService
   * @param alertService
   * @param router
   * @param workflowService
   * @param route
   * @param routerData
   * @param appToken
   * @param routerService
   * @param fb
   * @param lookUpService
   */
  constructor(
    readonly formBuilder: FormBuilder,
    readonly modalService: BsModalService,
    readonly validatorService: ValidatorService,
    readonly documentService: DocumentService,
    readonly uuidService: UuidGeneratorService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) public routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly routerService: RouterService,
    readonly fb: FormBuilder,
    readonly lookUpService: LookupService,
    readonly pLocation: PlatformLocation,
    readonly validatorRoutingService: ValidatorRoutingService,
    readonly location: Location,
    readonly menuService: MenuService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly authTokenService: AuthTokenService
  ) {
    super(
      formBuilder,
      alertService,
      validatorService,
      workflowService,
      uuidService,
      fb,
      router,
      modalService,
      lookUpService,
      route,
      documentService,
      routerData,
      appToken,
      pLocation,
      routerService,
      validatorRoutingService,
      location,
      menuService,
      transactionService,
      environment,
      authTokenService
    );
  }

  //Method to intialise tasks
  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
  }
}
