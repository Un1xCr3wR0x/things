import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomerSurveyService } from '../../../shared/services/customer-survey.service';
import { BehaviorSubject } from 'rxjs-compat';
import { AlertService, LanguageToken, getChannel } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { SurveyAnswer, SurveyDetailes } from '../../../shared';
import { Pagination } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'cim-customer-survey',
  templateUrl: './customer-survey.component.html',
  styleUrls: ['./customer-survey.component.scss']
})
export class CustomerSurveyComponent implements OnInit {

  lang: string = 'ar';
  userId: number;
  
  modalRef: BsModalRef;
  @ViewChild('surveyModal') surveyModalTemplate!: TemplateRef<HTMLElement>;
  surveyResponse: SurveyAnswer[];
  surveysList: SurveyDetailes[];
  selectedSurvey: SurveyDetailes;
  totalCount: number;
  isAllSurveyShown: boolean;
  pagination = new Pagination();
   itemsPerPage = 10;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    readonly activatedRoute: ActivatedRoute,
    readonly alertservice: AlertService,
    private customerSurveyService: CustomerSurveyService
  ) { }

  ngOnInit(): void {
    this.defaultPagination();

    this.activatedRoute.parent.params.subscribe(param => {
      if (param) {
        this.userId = Number(param.personId);
        this.getCustomerSurvey();
      }
    });

    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  getCustomerSurvey() {
    this.customerSurveyService.getCustomerSurvey(0, this.userId, 10).subscribe((data) => {
      //console.log('getCustomerSurvey', data);
      if (data?.elements.length > 0) {
        this.totalCount = data.elements[0].totalcount;
        this.surveysList = data.elements;
        this.surveysList.forEach(survey => {
          survey.CorrespondingChannel = getChannel(survey.channel);
        });
      }
    }, (error) => {
      this.alertservice.showErrorByKey('CUSTOMER-INFORMATION.ERROR-OCCURED');
    },
      () => { });
  }


 getAllCustomerSurvey() {
    this.customerSurveyService.getCustomerSurvey(this.currentPage - 1, this.userId, this.itemsPerPage).subscribe((data) => {
      //console.log('getCustomerSurvey', data);
      this.isAllSurveyShown = true;
      this.surveysList = data.elements;
      this.surveysList.forEach(survey => {
        survey.CorrespondingChannel = getChannel(survey.channel);
      });
    }, (error) => {
      this.alertservice.showErrorByKey('CUSTOMER-INFORMATION.ERROR-OCCURED');
    },
      () => { });
  }

  openSurveyDetails(survey) {
    this.surveyResponse = []; // Reset the survey response
    this.showModal();
    this.selectedSurvey = survey;
    this.customerSurveyService.getSurveyResponse(survey.uuid).subscribe((data) => {
      this.surveyResponse = data.elements
      //console.log('getSurveyResponse', data);
    });
  }

  /** Method to show modal. */
  /** This method is to trigger show modal event
   * @param template
   */
  showModal() {
    this.modalRef = this.modalService.show(this.surveyModalTemplate);
  }
  /*
   * This method is to trigger hide modal
   */
  hideModal() {
    if (this.modalRef && this.surveyResponse) this.modalRef.hide();
  }

  /**
   *
   * Methods to set default Parameters
   */
  defaultPagination() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.pageDetails = {
      currentPage: this.currentPage,
      goToPage: 1
    };
  }

  paginateSurvey(page: number): void {
    this.pageDetails.currentPage = this.currentPage = page;
    this.getAllCustomerSurvey();
  }
}
