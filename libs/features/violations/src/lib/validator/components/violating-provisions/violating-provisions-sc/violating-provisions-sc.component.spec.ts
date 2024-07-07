import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolatingProvisionsScComponent } from './violating-provisions-sc.component';

describe('ViolatingProvisionsScComponent', () => {
  let component: ViolatingProvisionsScComponent;
  let fixture: ComponentFixture<ViolatingProvisionsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViolatingProvisionsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolatingProvisionsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
