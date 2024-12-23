import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFactureVenteComponent } from './view-facture-vente.component';

describe('ViewFactureVenteComponent', () => {
  let component: ViewFactureVenteComponent;
  let fixture: ComponentFixture<ViewFactureVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFactureVenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFactureVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
