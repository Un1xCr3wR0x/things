/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { TimelineColourEnum } from '../../enums';

@Component({
  selector: 'est-timeline-dc',
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
  @Input() isLastItem = false;
  @Input() colour: TimelineColourEnum = TimelineColourEnum.DEFAULT;

  constructor() {}

  ngOnInit(): void {}
}
