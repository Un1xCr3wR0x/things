import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { IndividualSessionDetails, RescheduleSessionData } from '../../models';

@Component({
  selector: 'mb-adhoc-members-list-dc',
  templateUrl: './adhoc-members-list-dc.component.html',
  styleUrls: ['./adhoc-members-list-dc.component.scss']
})
export class AdhocMembersListDcComponent implements OnInit {
  lang = 'en';
  @Input() individualSessionDetails: IndividualSessionDetails;
  @Output() navigate = new EventEmitter<number>();
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
  }
  getMemberProfile(id: number) {
    this.navigate.emit(id);
  }
}
