import {Component, Inject, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertService,
  BilingualText,
  CalendarService,
  CoreIndividualProfileService,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import {
  CancelContributorService,
  ContributorBaseScComponent,
  ContributorConstants,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
// import { Chart } from 'chart.js';
import Chart from 'chart.js';
import {UninsuredList} from "@gosi-ui/features/contributor";


@Component({
  selector: 'cnt-health-insurance-details-dc',
  templateUrl: './health-insurance-details-dc.component.html',
  styleUrls: ['./health-insurance-details-dc.component.scss']
})
export class HealthInsuranceDetailsDcComponent extends ContributorBaseScComponent implements OnInit {
   lang: string;
  // @ViewChild('canvas') private commitmentRateChart: ElementRef;
  /* Chart reference */
  @ViewChild('commitmentRateChartCanvas', { static: true }) private commitmentRateChartCanvas: ElementRef;

  @Input() healthInsuranceCompanyName:BilingualText = Object.assign(new BilingualText(),{arabic: "شركة بوبا",english:"Bupa Insurance"});
  @Input() policyNumber:number = 1000001;
  @Input() policyEndDate:string = "01/01/2000";
  @Input() commitmentPercentage:number = 59;
  @Input() UninsuredList:UninsuredList = new UninsuredList();
  totalCommitmentPercentage:number;
  commitmentRateChart: Chart;

   /** Creates an instance of HealthInsuranceDetailsDcComponent. */
   constructor(
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly manageWageService: ManageWageService,
    readonly lookupService: LookupService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly cancelContributorService: CancelContributorService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly coreService: CoreIndividualProfileService,
    readonly location: Location,
    readonly calendarService:CalendarService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      workflowService,
      manageWageService,
      routerDataToken,
      calendarService
    );
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    // this.createDoughnutChart();
    console.log("this is Percentage :",this.commitmentPercentage);
    this.createDoughnutChart(this.commitmentPercentage);
  }
  createDoughnutChart(commitmentPercentage:number) {
    this.destroyChart();
    this.totalCommitmentPercentage = 100 - this.commitmentPercentage;
    this.commitmentRateChart = new Chart(this.commitmentRateChartCanvas.nativeElement, {
      type: 'doughnut', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: [],
        datasets: [{
          label: '',
          data: [this.commitmentPercentage,this.totalCommitmentPercentage, ],
          backgroundColor: [
            '#1BAF5D','#e4fff0',
          ],
          borderWidth:0,
        }],
      },
      options: {
        tooltips:{enabled:false},
        hover:{mode:null},
        plugins:{
          legend:true,
          textInside:true,
        },
        maintainAspectRatio: false,
        responsive: true,
        cutoutPercentage: 70
      },
      plugins: {
        beforeDraw : function(chart){
          const width = chart.width;
          const height = chart.height;
          const ctx = chart.ctx;
          ctx.restore();
          const text = `${commitmentPercentage}%`;
          const x = Math.round((width - ctx.measureText(text).width) /2);
          const y = height /2;
          ctx.font='bold 20px DIN Next LT Arabic'
          ctx.fillStyle='#25815B'
          ctx.fillText(text,x,y);
          ctx.save();
        }
      }
    });
  }
  destroyChart() {
    if (typeof this.commitmentPercentage != 'undefined') this.commitmentRateChart?.destroy();
  }
}
