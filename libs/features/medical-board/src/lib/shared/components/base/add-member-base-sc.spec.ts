/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlertService,
  ApplicationTypeToken,
  LookupService,
  RouterDataToken,
  RouterData,
  DocumentService,
  EnvironmentToken
} from '@gosi-ui/core';
import { AlertServiceStub, LookupServiceStub, genericError, memberDataMock, MemberServiceStub } from 'testing';
import { AddMemberBaseSc } from './add-member-base-sc';
import { MemberService } from '../../services';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { MemberData } from '../..';

@Component({
  selector: 'mb-add-member-derived'
})
export class DerivedAddMemberBase extends AddMemberBaseSc {
  constructor(
    public alertService: AlertService,
    public documentService: DocumentService,
    public lookupService: LookupService,
    public memberService: MemberService,
    public router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(alertService, documentService, lookupService, memberService, router, appToken, routerDataToken);
  }
}

/**
 * Unit test for add-contribitor base class
 */
describe('AddMemberBaseSc', () => {
  let component: DerivedAddMemberBase;
  let fixture: ComponentFixture<DerivedAddMemberBase>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [DerivedAddMemberBase],
      providers: [
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: MemberService, useClass: MemberServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(DerivedAddMemberBase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all lov list', () => {
    component.setLovLists();
    expect(component.nationalityList$).toBeDefined();
    expect(component.cityList$).toBeDefined();
    expect(component.gccCountryList$).toBeDefined();
    expect(component.genderList$).toBeDefined();
    expect(component.doctorType$).toBeDefined();
    expect(component.medicalboardtype$).toBeDefined();
    expect(component.specialty$).toBeDefined();
    expect(component.region$).toBeDefined();
    expect(component.hospital$).toBeDefined();
    expect(component.feespervisit$).toBeDefined();
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should cancel form', () => {
    component.member = new MemberData();
    spyOn(component.router, 'navigate');
    spyOn(component, 'hideModal');
    // component.cancelForm();
    expect(component.hideModal).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/medical-board/list-members']);
  });
  it('should create alert error', () => {
    spyOn(component.alertService, 'showError');
    component.showError(genericError);
    expect(component.alertService.showError).toHaveBeenCalled();
  });
});
