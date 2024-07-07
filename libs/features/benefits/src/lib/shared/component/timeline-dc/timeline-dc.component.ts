/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { TimelineColourEnum } from '../../enum';

@Component({
  selector: 'bnt-timeline-dc',
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
