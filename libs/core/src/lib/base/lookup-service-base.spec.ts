// /**
//  * Copyright GOSI. All Rights Reserved.
//  * This software is the proprietary information of GOSI.
//  * Use is subject to license terms.
//  */

// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { Component } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { BehaviorSubject } from 'rxjs';
// import { WorkflowServiceStub } from 'testing';
// import { ApplicationTypeEnum } from '../enums';
// import { RouterData } from '../models';
// import { WorkflowService } from '../services';
// import { ApplicationTypeToken, LanguageToken, RouterDataToken } from '../tokens';
// import { LookUpServiceBase } from './lookup-service-base';

// @Component({
//   selector: 'lookup-service-base-derived'
// })
// export class DerivedLookUpServiceBase extends LookUpServiceBase {}
// describe('LookUpServiceBase', () => {
//   let component: DerivedLookUpServiceBase;
//   let fixture: ComponentFixture<DerivedLookUpServiceBase>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [BrowserDynamicTestingModule, RouterTestingModule, HttpClientTestingModule],
//       providers: [
//         { provide: RouterDataToken, useValue: new RouterData() },
//         {
//           provide: LanguageToken,
//           useValue: new BehaviorSubject<string>('en')
//         },
//         {
//           provide: ApplicationTypeToken,
//           useValue: ApplicationTypeEnum.PRIVATE
//         },
//         { provide: WorkflowService, useClass: WorkflowServiceStub }
//       ],
//       declarations: [DerivedLookUpServiceBase]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(DerivedLookUpServiceBase);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
