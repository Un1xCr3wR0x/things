import { Component, OnInit, Inject } from '@angular/core';
import { AlertService, LanguageToken } from '@gosi-ui/core';
import { InstallmentService } from '../../../shared/services';
import { InstallmentHistory } from '../../../shared/models';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { InstallmentConstants } from '../../../shared/constants';

@Component({
  selector: 'blg-installment-history-sc',
  templateUrl: './installment-history-sc.component.html',
  styleUrls: ['./installment-history-sc.component.scss']
})
export class InstallmentHistoryScComponent implements OnInit {
  /**-----------------Local Variables-------------------- */
  lang = 'en';
  installmentHistory: InstallmentHistory;

  constructor(
    readonly alertService: AlertService,
    readonly installmentService: InstallmentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.getInstallments(this.installmentService.getRegistrationNo);
  }
  getInstallments(regNumber: number) {
    this.installmentService.getInstallmentactive(regNumber, false).subscribe(
      installment => {
        this.installmentHistory = installment;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  navigateToSummary(id = null) {
    if (id) this.installmentService.setInstallmentId = id;
    this.router.navigate([InstallmentConstants.INSTALLMENT_SUMMARY, { from: 'history' }]);
  }
}
