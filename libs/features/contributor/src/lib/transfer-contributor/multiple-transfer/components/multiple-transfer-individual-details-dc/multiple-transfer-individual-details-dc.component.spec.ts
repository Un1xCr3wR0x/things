import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTransferIndividualDetailsDcComponent } from './multiple-transfer-individual-details-dc.component';

describe('MultipleTransferIndividualDetailsDcComponent', () => {
  let component: MultipleTransferIndividualDetailsDcComponent;
  let fixture: ComponentFixture<MultipleTransferIndividualDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleTransferIndividualDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTransferIndividualDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
