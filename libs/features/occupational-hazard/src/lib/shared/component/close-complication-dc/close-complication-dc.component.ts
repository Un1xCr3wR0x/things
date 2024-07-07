import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, OnChanges, Inject } from '@angular/core';
import { BilingualText, formatDate, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { Complication, Injury } from '../../models';

@Component({
  selector: 'oh-close-complication-dc',
  templateUrl: './close-complication-dc.component.html',
  styleUrls: ['./close-complication-dc.component.scss']
})
export class CloseComplicationDcComponent implements OnInit, OnChanges {
  @Input() complication: Complication;
  @Input() injury: Injury;
  @Input() canEdit = false;
  @Input() close = false;
  @Input() complicationClosingStatus: BilingualText;
  @Input() showHeading = true;

  /**
   * Output variables
   */

  @Output() injurySelected: EventEmitter<number> = new EventEmitter();
  @Output() complicationSelected: EventEmitter<Complication> = new EventEmitter();
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  lang: String;
  injId: number;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.getInjuryId();
  }

  /**
   * Capturing input on changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.complication) {
      this.complication = changes.complication.currentValue;
    }
    if (changes && changes.complicationClosingStatus) {
      this.complicationClosingStatus = changes.complicationClosingStatus.currentValue;
    }
    if (changes && changes.injury) {
      this.injury = changes.injury.currentValue;
    }
    if (changes && changes.canEdit) {
      this.canEdit = changes.canEdit.currentValue;
    }
    this.getInjuryId();
  }
  /**
   * Method to emit complication
   * @param complication
   */
  viewComplicationDetails(complication: Complication) {
    this.complicationSelected.emit(complication);
  }
  /**
   * Method to emit edit indicator
   */
  navigateToClose() {
    this.onEdit.emit();
  }
  /**
   * To get Injury Id for Complication scenarios
   */
  getInjuryId() {
    this.injId = this.complication.injuryDetails.injuryId;
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  /**
   * to view injury details
   */
  viewInjuryDetails(injId: number) {
    this.injurySelected.emit(injId);
  }
}
