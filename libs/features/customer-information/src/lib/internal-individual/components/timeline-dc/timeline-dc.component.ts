import { Component, Input, OnInit } from '@angular/core';
import { TimelineColourEnum } from '../../../shared/enums/timeline-colour-enum';

@Component({
  selector: 'cim-timeline-dc',
  templateUrl: './timeline-dc.component.html',
  styleUrls: ['./timeline-dc.component.scss']
})
export class TimelineDcComponent implements OnInit {

  timelineColourMap: Map<string, TimelineColourEnum> = new Map([
    ['default', TimelineColourEnum.DEFAULT],
    ['green', TimelineColourEnum.GREEN],
    ['red', TimelineColourEnum.RED],
    ['orange', TimelineColourEnum.ORANGE]
  ]);
  @Input() isFirstItem = false;
  @Input() colour: TimelineColourEnum = TimelineColourEnum.DEFAULT;
  @Input() circleColor: TimelineColourEnum = TimelineColourEnum.DEFAULT;
  @Input() paddingTop: boolean;
  @Input() paddingBottom: boolean;

  constructor() {}

  ngOnInit(): void {}

}
