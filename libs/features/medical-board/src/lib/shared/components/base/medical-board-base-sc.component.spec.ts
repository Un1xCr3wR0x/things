/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, LookupService } from '@gosi-ui/core';
import { noop, of, throwError } from 'rxjs';
import { AlertServiceStub, genericError, LookupServiceStub, memberDataMock } from 'testing';
import { MemberService } from '../../services';
import { MbBaseScComponent } from './medical-board-base-sc.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MemberData } from '../..';

@Component({
  selector: 'mb-member-board-base-derived'
})
export class DerivedMemberBoardBaseSc extends MbBaseScComponent {
  constructor(
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly memberService: MemberService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(alertService, lookupService, memberService, appToken);
  }
}

/**
 * Unit test for add-contribitor base class
 */
describe('MemberBoardBaseScComponent', () => {
  let component: DerivedMemberBoardBaseSc;
  let fixture: ComponentFixture<DerivedMemberBoardBaseSc>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [DerivedMemberBoardBaseSc],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(DerivedMemberBoardBaseSc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all lov list', () => {
    component.setLookUpLists();
    expect(component.nationalityList$).toBeDefined();
    expect(component.doctorType$).toBeDefined();
    expect(component.specialty$).toBeDefined();
    expect(component.region$).toBeDefined();
  });

  it('should create alert error', () => {
    spyOn(component.alertService, 'showError');
    component.showError(genericError);
    expect(component.alertService.showError).toHaveBeenCalled();
  });

  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('should get fees', () => {
    spyOn(component.memberService, 'getFees');
    component.getFees(new MemberData());
    expect(component.fees).not.toBe(null);
  });
  it('should show mandatory error', () => {
    spyOn(component.alertService, 'showMandatoryErrorMessage');
    component.showFormInvalid();
    expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
  });

  it('Should getBank', () => {
    component.getBankDetails('55');
    expect(component.bankName).not.toBe(null);
  });
});
