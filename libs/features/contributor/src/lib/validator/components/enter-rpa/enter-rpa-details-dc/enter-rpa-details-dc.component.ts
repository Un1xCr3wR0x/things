import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, DocumentService, LookupService, RouterData, RouterDataToken, WorkflowService, checkBilingualTextNull } from '@gosi-ui/core';
import { AddAuthorizationService, ContributorService, EstablishmentService, ValidatorBaseScComponent } from '@gosi-ui/features/contributor/lib/shared';
import { Contributor } from '@gosi-ui/features/contributor/lib/shared/models';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cnt-enter-rpa-details-dc',
  templateUrl: './enter-rpa-details-dc.component.html',
  styleUrls: ['./enter-rpa-details-dc.component.scss']
})
export class EnterRpaDetailsDcComponent extends ValidatorBaseScComponent implements OnInit {

  contributor = new Contributor();
  dob:string;
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly addAuthorizationService: AddAuthorizationService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly router: Router,
    @Inject(RouterDataToken) private routerData: RouterData
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
  }

  ngOnInit(): void {
    const payload = JSON.parse(this.routerData.payload);
      if (payload.registrationNo) this.registrationNo = payload.registrationNo;
      if (payload.socialInsuranceNo) this.socialInsuranceNo = payload.socialInsuranceNo;
    this.getIndividualContributorDetails();
  }
   /**
   * This method is to check if the data is null or not
   * @param control
   */
   checkNull(control) {
    return checkBilingualTextNull(control);
  }

  /** Method to get contributor details. */
  getIndividualContributorDetails() {
    this.contributorService.getIndividualContDetails(this.socialInsuranceNo).subscribe(
      (res) => {
        this.contributor = res;
        // this.contributorType = res.contributorType;
        // this.getEstablishmentData();
      },
      err => {
        if (err.error) {
          this.alertService.showError(err.error);
        }
      }
    );
  }

}
function tap(arg0: (data: any) => void): any {
  throw new Error('Function not implemented.');
}

