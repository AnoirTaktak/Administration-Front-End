import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterFactureVenteComponent } from './consulter-facture-vente.component';

describe('ConsulterFactureVenteComponent', () => {
  let component: ConsulterFactureVenteComponent;
  let fixture: ComponentFixture<ConsulterFactureVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsulterFactureVenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsulterFactureVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
