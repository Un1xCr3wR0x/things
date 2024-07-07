import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContactRouteConstants } from '../../../shared/constants';

@Component({
  selector: 'gosi-ui-write-us-details-sc',
  templateUrl: './write-us-details-sc.component.html',
  styleUrls: ['./write-us-details-sc.component.scss']
})
export class WriteUsDetailsScComponent extends BaseComponent implements OnInit {
  complaintUrl: string;
  enquiryUrl: string;
  requestUrl: string;
  appealUrl: string;
  pleaUrl: string;
  suggestionUrl: string;
  width: any;
  setOfTwo: boolean = false;
  constructor(readonly router: Router, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  @HostListener('window:resize', ['$event'])
  onWIndowREsize() {
    this.width = window.innerWidth;
    if (this.width > 800 && this.width < 1115) {
      this.setOfTwo = true;
    } else {
      this.setOfTwo = false;
    }
  }
  ngOnInit(): void {
    this.onWIndowREsize();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      if (lang === 'en') {
        this.complaintUrl = ContactRouteConstants.ROUTER_APPLY_COMPLAINT;
        this.enquiryUrl = ContactRouteConstants.ROUTER_APPLY_ENQUIRY;
        this.requestUrl = ContactRouteConstants.ROUTER_APPLY_REQUEST;
        this.appealUrl = ContactRouteConstants.ROUTER_APPLY_APPEAL;
        this.pleaUrl = ContactRouteConstants.ROUTER_APPLY_PLEA;
        this.suggestionUrl = ContactRouteConstants.ROUTER_APPLY_SUGGESTION;
      } else {
        this.complaintUrl = ContactRouteConstants.ROUTER_APPLY_COMPLAINT_AR;
        this.enquiryUrl = ContactRouteConstants.ROUTER_APPLY_ENQUIRY_AR;
        this.requestUrl = ContactRouteConstants.ROUTER_APPLY_REQUEST_AR;
        this.appealUrl = ContactRouteConstants.ROUTER_APPLY_APPEAL_AR;
        this.pleaUrl = ContactRouteConstants.ROUTER_APPLY_PLEA_AR;
        this.suggestionUrl = ContactRouteConstants.ROUTER_APPLY_SUGGESTION_AR;
      }
    });
  }
  onBack() {}
  onApplyComplaint() {
    window.open(this.complaintUrl);
  }
  onApplyEnquiry() {
    window.open(this.enquiryUrl);
  }
  onApplyRequest() {
    window.open(this.requestUrl);
  }
  onApplyAppeal() {
    window.open(this.appealUrl);
  }
  onApplyPlea() {
    window.open(this.pleaUrl);
  }
  onApplySuggestion() {
    window.open(this.suggestionUrl);
  }
}
