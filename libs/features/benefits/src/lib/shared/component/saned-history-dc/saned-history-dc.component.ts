import { Component, Input, OnInit } from '@angular/core';
import { UIHistoryDto } from '../../models';
import { SanedConstants } from '../../constants';
import { TimelineColourEnum } from '../../enum/timeline-colour-enum';

@Component({
  selector: 'bnt-saned-history-dc',
  templateUrl: './saned-history-dc.component.html',
  styleUrls: ['./saned-history-dc.component.scss']
})
export class SanedHistoryDcComponent implements OnInit {
  constructor() {}

  @Input() history: UIHistoryDto;
  @Input() lang = 'en';

  timelineColourMap: Map<string, TimelineColourEnum> = new Map([
    ['default', TimelineColourEnum.DEFAULT],
    [SanedConstants.ACTIVE.english, TimelineColourEnum.GREEN],
    [SanedConstants.REACTIVATE.english, TimelineColourEnum.GREEN],
    [SanedConstants.STOPPED.english, TimelineColourEnum.RED],
    [SanedConstants.SUSPENDED.english, TimelineColourEnum.ORANGE]
  ]);

  ngOnInit(): void {}

  getColor(status: string) {
    return this.timelineColourMap.get(status) || this.timelineColourMap.get('default');
  }
}
