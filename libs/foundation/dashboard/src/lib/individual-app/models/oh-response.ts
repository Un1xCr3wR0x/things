import { InjuryHistoryData } from './injury-history-data';

export class OHResponse {
  diseasePresent: boolean;
  injuryHistory: InjuryHistoryData[];
  totalCount: number;
}
