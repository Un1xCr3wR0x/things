import { BilingualText, GosiCalendar } from "@gosi-ui/core";

export class ModifyRequestList{
    arabicName?:changedValues;
    englishName?:changedValues;
    dob?:changedValues;
    passportNo?:changedValues;
    passportExpiryDate?:changedValues;
    passportIssueDate?:changedValues;
    borderNumber?:changedValues;
    maritalStatus?:changedValues;
    gender?:changedValues;
    education?:changedValues;
    specialization?:changedValues; 
    mobileNo?:changedValues;
    email?:changedValues;
    naStreetName?:changedValues;
    naAdditionalNo?:changedValues;
    naBuildingNo?:changedValues;
    naCity?:changedValues;
    naPostalCode?:changedValues;
    naDistrict?:changedValues;
    naCityDistrict?:changedValues;
    naUnitNo?:changedValues;
    poCity?:changedValues;
    poCityDistrict?:changedValues;
    poPostBox?:changedValues;
    poPostalCode?:changedValues;
    ovCountry?:changedValues;
    ovCity?:changedValues;
    ovAddress?:changedValues;
    
  }

  export class changedValues{
  oldValue:BilingualText;
  newValue:BilingualText;
  newDate:GosiCalendar = new GosiCalendar();
  oldDate:GosiCalendar = new GosiCalendar();
  }
