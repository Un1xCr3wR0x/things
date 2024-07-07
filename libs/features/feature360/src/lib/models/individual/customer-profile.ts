import { Address } from './address';
import { DependentList } from './dependent-list';

export class CustomerProfile {
  id: number = undefined;
  socialinsuracenumber: number = undefined;
  birthdate: Date = new Date();
  nationality: string = undefined;
  nationalitycode: number = undefined;

  address: Address[] = [];
  dependentlist: DependentList[] = [];

  nameenglish: string = undefined;
  namearabic: string = undefined;
  usertype: string = undefined;
  activecontributor: string = undefined;
  inactivecontributor: string = undefined;
  activebeneficiary: string = undefined;
  inactivebeneficiary: string = undefined;
  activesanedbeneficiary: string = undefined;
  inactivesanedbeneficiary: string = undefined;
  activevic: string = undefined;
  age: number = undefined;
  sex: string = undefined;
  numberofactivedependents: number = undefined;
}
