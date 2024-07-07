import { Lov } from '../establishments/lov';

export class AdminFilterResponse {
  nationalitiesPresent: Array<Lov> = [];
  roles: number[];
}
