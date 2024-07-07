import { Component, Input } from '@angular/core';
import {
  AggregatedTypes,
  EngagementTypesEnums,
  IPensionReformEngagement
} from '@gosi-ui/features/customer-information/lib/shared';

@Component({
  selector: 'cim-pension-reform-time-line',
  templateUrl: './pension-reform-time-line.component.html',
  styleUrls: ['../../pension-reform/pension-reform.component.scss']
})
export class PensionReformTimeLineComponent {
  @Input() engagements: IPensionReformEngagement[] = [];
  lang: string = 'ar';
  engagementTypes = EngagementTypesEnums;
  get aggregatedType(): typeof AggregatedTypes {
    return AggregatedTypes;
  }
}
