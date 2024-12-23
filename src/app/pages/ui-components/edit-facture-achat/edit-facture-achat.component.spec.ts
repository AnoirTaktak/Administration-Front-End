import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFactureAchatComponent } from './edit-facture-achat.component';

describe('EditFactureAchatComponent', () => {
  let component: EditFactureAchatComponent;
  let fixture: ComponentFixture<EditFactureAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFactureAchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFactureAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
