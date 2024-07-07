import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemService } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BilingualTextPipeMock, SystemServiceStub } from 'testing';
import { SystemStatusScComponent } from './system-status-sc.component';
describe('SystemStatusScComponent', () => {
  let component: SystemStatusScComponent;
  let fixture: ComponentFixture<SystemStatusScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SystemStatusScComponent, BilingualTextPipeMock],
      providers: [{ provide: SystemService, useClass: SystemServiceStub }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemStatusScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
