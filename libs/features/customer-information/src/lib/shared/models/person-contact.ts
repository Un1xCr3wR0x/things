import { BilingualText } from "@gosi-ui/core";
import { ContactEstablishment } from "./establishment";

export class PersonContact {
    contactId:string;
    mobileNo:string;
    isdCodePrimary:string;
    email:string;
    establishmentList:ContactEstablishment[] = [];
    isVerified:boolean;
}

export class AddContactRequest {
    mobileNo:string;
    email:string;
    isdCodePrimary:string;
}

export class UpdateMobileRequest {
    mobileNo:string;
    isdCodePrimary:string;
}

export class UpdateEmailRequest {
    email:string;
}



export class AddContactResponse {
    contactId:string;
    message: BilingualText = new BilingualText();
}

export class ContactResponse {
    id:string;
    email:string;
    mobileNo:string;
    isdCodePrimary:string;
    isVerified:boolean;
}

export class GetContactResponse {
    contactDetails:ContactResponse[] = [];
}

export class ContactEstablishmentResponse {
    registrationNoList:string[] = [];
}

export class VerifyContactRequest{
    mobileNo:string;
    isdCodePrimary:string;
    email:string;
}

export class Establishments{
    registrationNo:number=undefined;
    name: BilingualText = new BilingualText();
}

export class VerifyContactResponse{
    contactId:number
}