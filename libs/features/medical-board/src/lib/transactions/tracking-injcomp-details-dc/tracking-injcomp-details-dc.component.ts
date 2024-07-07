import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Complication } from '../../shared';
import { Injury, LanguageToken, formatDate } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mb-tracking-injcomp-details-dc',
  templateUrl: './tracking-injcomp-details-dc.component.html',
  styleUrls: ['./tracking-injcomp-details-dc.component.scss']
})
export class TrackingInjcompDetailsDcComponent implements OnInit, OnChanges {
  @Input() complication: Complication;
  @Input() injury: Injury;

  @Output() injurySelected: EventEmitter<number> = new EventEmitter();
  @Output() complicationSelected: EventEmitter<Complication> = new EventEmitter();
  // for injury
  @Output() injurySelect: EventEmitter<Injury> = new EventEmitter();

  lang = 'en';

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.complication) {
      this.complication = changes.complication.currentValue;
    }
    if (changes && changes.injury) {
      this.injury = changes.injury.currentValue;
    }
  }
  viewInjuryDetails(val?) {
    this.injurySelect.emit(val);
  }
  viewComplicationDetails(complication: Complication) {
    this.complicationSelected.emit(complication);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  viewInjuryDetail(injId: number) {
    this.injurySelected.emit(injId);
  }
}
