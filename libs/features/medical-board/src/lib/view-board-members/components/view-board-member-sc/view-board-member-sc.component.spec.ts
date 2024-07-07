/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, ApplicationTypeToken, bindToObject, LookupService } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  boardMembersListMock,
  genericError,
  LookupServiceStub,
  MedicalBoardServiceStub
} from 'testing';
import { MemberRequest, MemberResponse } from '../../../shared';
import { MedicalBoardService } from '../../../shared/services';
import { ViewBoardMemberScComponent } from './view-board-member-sc.component';

describe('ViewBoardMemberScComponent', () => {
  let component: ViewBoardMemberScComponent;
  let fixture: ComponentFixture<ViewBoardMemberScComponent>;
  let spy: jasmine.Spy;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ViewBoardMemberScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: MedicalBoardService, useClass: MedicalBoardServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBoardMemberScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('must initialize component', () => {
    spyOn(component, 'initializeView').and.callThrough();
    component.ngOnInit();
    expect(component.initializeView).toHaveBeenCalled();
  });

  it('should throw error on fetching medical members details', () => {
    spyOn(component.medicalBoardService, 'getTransactions').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getMembers();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should navigate to add member page', () => {
    spyOn(component.router, 'navigate');
    component.addMember();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/medical-board/add-members']);
  });

  it('should navigate to corresponding doctor profile page', () => {
    spyOn(component.router, 'navigate');
    component.memberNavigation(2015767656);
    expect(component.router.navigate).toHaveBeenCalledWith([
      'home/medical-board/doctor-profile/2015767656/person-details'
    ]);
  });

  it('should paginate while checking on members list of other pages', () => {
    component.pageDetails.currentPage = 2;
    spyOn(component, 'getMembers');
    component.paginateMemberList(1);
    expect(component.getMembers).toHaveBeenCalled();
  });

  it('should successfully  fetch medical members details', () => {
    spyOn(component.medicalBoardService, 'getTransactions').and.returnValue(
      of(bindToObject(new MemberResponse(), boardMembersListMock))
    );
    component.getMembers();
    expect(component.medicalBoardService.getTransactions).toHaveBeenCalled();
    expect(component.filteredMember).not.toEqual(null);
    expect(component.totalItems).not.toEqual(null);
  });

  it('It should search for all the matching transactions ', () => {
    spyOn(component, 'getMembers').and.callThrough();
    component.searchMembers('1000');
    expect(component.memberRequest.searchKey).toBe('1000');
    expect(component.getMembers).toHaveBeenCalled();
  });

  it('It should search for all the matching transactions ', () => {
    spyOn(component, 'getMembers').and.callThrough();
    component.searchMembers('');
    expect(component.memberRequest.searchKey).toEqual(undefined);
    expect(component.getMembers).toHaveBeenCalled();
  });

  it('It should filter the transactions', () => {
    spyOn(component, 'getMembers').and.callThrough();
    component.filterMembers(new MemberRequest());
    expect(component.memberRequest).toBeDefined();
    expect(component.getMembers).toHaveBeenCalled();
  });

  it('should call statusbadgetype function', () => {
    spyOn(component, 'statusBadgeType').and.callThrough();
    component.statusBadgeType();
    expect(component.statusBadgeType).toHaveBeenCalled();
  });
});
