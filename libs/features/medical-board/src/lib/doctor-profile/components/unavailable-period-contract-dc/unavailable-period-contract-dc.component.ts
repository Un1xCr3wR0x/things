import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MBConstants } from '../../../shared/constants';
import { UnAvailabilityPeriod } from '../../../shared/models';


@Component({
  selector: 'mb-unavailable-period-contract-dc',
  templateUrl: './unavailable-period-contract-dc.component.html',
  styleUrls: ['./unavailable-period-contract-dc.component.scss']
})
export class UnavailablePeriodContractDcComponent implements OnInit {
  @Input()  unavailableList: UnAvailabilityPeriod[];
  @Input() unavailablePopUP ;
  lang = 'en';
  @Output() unavailableaddEvent = new EventEmitter<string>();
  @Output() setIndex: EventEmitter<number> = new EventEmitter<number>();
  index: number;
  removeMessage: BilingualText = new BilingualText();
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.language.subscribe(language => (this.lang = language));
  }
  addunavailablePeriod() {
    const unavailableUrl = this.router.url;
    this.unavailableaddEvent.emit(unavailableUrl)
  }
 onClickIcon(index:number) {
  this.setIndex.emit(index);
 }
  showRemoveModal(template: TemplateRef<HTMLElement>) {
    const startDate = moment(this.unavailableList[this.index]?.startDate.gregorian).format('DD-MM-YYYY');
    const endDate = moment(this.unavailableList[this.index]?.endDate.gregorian).format('DD-MM-YYYY');
    this.removeMessage = MBConstants.REMOVEMESSAGE(startDate, endDate);
    this.modalRef = this.modalService.show(template);
  }


}
