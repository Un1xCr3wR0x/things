import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { WageInfo } from '@gosi-ui/features/contributor';


export class violationPeriodRequest{
    comments?:string;
    contributorAbroadIndicator?:boolean;
    endDate?:GosiCalendar = new GosiCalendar();
    occupation?:BilingualText = new BilingualText();
    startDate?:GosiCalendar = new GosiCalendar();   
    wage?:WageInfo = new WageInfo();
    wageCoverageId?:number;
    wageDetailsUpdated?:number;
}