import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFactureAchatComponent } from './add-facture-achat.component';

describe('AddFactureAchatComponent', () => {
  let component: AddFactureAchatComponent;
  let fixture: ComponentFixture<AddFactureAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFactureAchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFactureAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
