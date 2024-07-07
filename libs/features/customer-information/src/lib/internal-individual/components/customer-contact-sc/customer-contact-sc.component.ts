import { Component, Inject, OnInit } from '@angular/core';
import { CustomerContactService } from '../../../shared/services/customer-contact.service';
import { BehaviorSubject } from 'rxjs-compat';
import { LanguageToken, AlertService } from '@gosi-ui/core';
import { ContactEvents, TouchpointResponse } from '../../../shared/models/touch-point-response';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cim-customer-contact-sc',
  templateUrl: './customer-contact-sc.component.html',
  styleUrls: ['./customer-contact-sc.component.scss']
})
export class CustomerContactScComponent implements OnInit {

  userContactResponse: ContactEvents[] = [];
  userId: number;
  lang: string
  
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly customerContactService: CustomerContactService,
    readonly activatedRoute: ActivatedRoute,
    readonly alertservice: AlertService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.params.subscribe(param => {
      if (param){ 
        this.userId = Number(param.personId);
        this.getContactLog();
      }
      this.language.subscribe(lang => {
        this.lang = lang ;
      });
    });

  }

  getContactLog(){
    this.customerContactService.getCustomerContactLog(this.userId).subscribe(
      response => {
        this.userContactResponse = response.elements;
        this.userContactResponse.forEach( event =>{
          event.date ? event.date = event.date.split('-').join('/') : '';
        })
      },
      err => {
        this.alertservice.showErrorByKey('CUSTOMER-INFORMATION.ERROR-OCCURED');
      },
      () => {}
    );
  }
}
