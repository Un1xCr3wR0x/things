import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, ApplicationTypeToken, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { IndividualDashboardScComponent } from './individual-dashboard-sc.component';

describe('IndividualAppDashboardScComponent', () => {
  let component: IndividualDashboardScComponent;
  let fixture: ComponentFixture<IndividualDashboardScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IndividualDashboardScComponent],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDashboardScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
