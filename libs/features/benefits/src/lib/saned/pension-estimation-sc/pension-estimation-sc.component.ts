import { Component, HostListener, Inject, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, CoreContributorService, LanguageToken, Lov, LovList } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { AnnuityResponseDto, BenefitDetails } from '../../shared/models';
import { ManageBenefitService, SanedBenefitService } from '../../shared/services';

@Component({
  selector: 'bnt-pension-estimation-sc',
  templateUrl: './pension-estimation-sc.component.html',
  styleUrls: ['./pension-estimation-sc.component.scss']
})
export class PensionEstimationScComponent implements OnInit, OnDestroy {
  pensionEstimationForm: FormGroup;
  isSmallScreen: boolean;
  amwResponse: AnnuityResponseDto;
  yearListLov: Lov[];
  numberList: string[] = ['0%','1%', '2%', '3%', '4%', '5%', '6%', '7%', '8%', '9%', '10%', '11%', '12%', '13%'];
  numberOfDepList = new LovList([]);
  calcResponse: BenefitDetails;
  lang = 'en';

  constructor(
    private fb: FormBuilder,
    public contributorService: CoreContributorService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly manageBenefitService: ManageBenefitService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
      if (this.lang === 'en') {
        this.calcViewOnly();
      } else {
        this.calcViewOnly('ar');
      }
    });
    this.pensionEstimationForm = this.createForm();
    //this.fetchAmw(this.manageBenefitService.nin);
    this.fetchHijiriYear();
    this.fetchNumberOfDep();
  }

  createForm() {
    return this.fb.group({
      retirementYear: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      wagePercentage: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      numberOfDependents: [
        null,
        {
          validators: Validators.compose([Validators.pattern('[0-9]+'), Validators.required]),
          updateOn: 'blur'
        }
      ]
    });
  }

  // fetchAmw(nin: number) {
  //   if (nin) {
  //     this.sanedBenefitService.getAmw(nin).subscribe(
  //       res => {
  //         this.amwResponse = res;
  //       },
  //       err => this.alertService.showError(err.error.message)
  //     );
  //   }
  // }

  fetchHijiriYear() {
    this.sanedBenefitService.fetchHijiriYear().subscribe(
      res => {
        if (res.length > 0) {
          this.yearListLov = [];
          res.forEach((year, index) => {
            const lov = new Lov();
            lov.sequence = index;
            lov.value = { english: year.toString(), arabic: year.toString() };
            this.yearListLov.push(lov);
          });
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  fetchNumberOfDep() {
    this.numberList.forEach(dep => {
      this.numberOfDepList?.items?.push({
        ...new Lov(),
        value: { english: dep.toString(), arabic: dep.toString() }
      });
    });
  }

  calcViewOnly(lang?: string) {
    const noDependents = 0;
    const wagePercentage = 0;
    this.sanedBenefitService
      .getPensionCalculator(noDependents, null, wagePercentage, this.manageBenefitService.nin, lang)
      .subscribe(
        res => {
          this.alertService.clearAllErrorAlerts();
          this.calcResponse = res;
        },
        err => this.alertService.showError(err.error.message)
      );
  }
  calculate(lang?: string) {
    if (this.pensionEstimationForm.valid) {
      const noDependents = this.pensionEstimationForm.get('numberOfDependents').value;
      const hijiriYear = this.pensionEstimationForm.get('retirementYear').get('english').value;
      const wagePercentage = this.pensionEstimationForm.get('wagePercentage').get('english').value.split('%');
      this.sanedBenefitService
        .getPensionCalculator(noDependents, hijiriYear, wagePercentage[0], this.manageBenefitService.nin, lang)
        .subscribe(
          res => {
            this.alertService.clearAllErrorAlerts();
            this.calcResponse = res;
          },
          err => this.alertService.showError(err.error.message)
        );
    } else {
      this.pensionEstimationForm.markAllAsTouched();
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  clearAllAlerts() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  /** Method to handle c;aring alerts before component destroyal . */
  ngOnDestroy() {
    this.clearAllAlerts();
  }
}
