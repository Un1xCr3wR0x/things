import { BilingualText } from "./bilingual-text";

// export class ContributorGlobalSearch{
//   searchedContributor:SearchedContributor[];
// }
export class ContributorGlobalSearch{
    name:{
      arabic:{
        firstName:String;
        secondName:String;
        thirdName:String;
        familyName:String;
      }
      english:{
        name:String;
      }
    };
    registrationNo:number;
    nationality:BilingualText=new BilingualText();
    socialInsuranceNumber:number;
    establishmentName:BilingualText=new BilingualText();
    status:String;
    gender:BilingualText=new BilingualText();
  }