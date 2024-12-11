import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatError } from '@angular/material/form-field';
import { ServiceService } from 'src/app/services/service_service/service-service.service';
import { Service } from 'src/Models/service';

@Component({
  selector: 'app-add-service',
  standalone:true,
  imports:[
    ReactiveFormsModule,
    CommonModule,

  ],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.scss'
})
export class AddServiceComponent {

  addServiceForm!: FormGroup;
  existingDess: any[] = [];
  isDateFinDisabled = false;

  constructor(
    public dialogRef: MatDialogRef<AddServiceComponent>,
    private fb: FormBuilder,
    private ServiceService: ServiceService
  ) {}

  ngOnInit(): void {

    this.loadServicesData();
    this.addServiceForm = this.fb.group({
      Designation_Service: ['', Validators.required],
      PrixHT: [{ value: null, disabled: true }],
      TVA: [, [Validators.required, this.tvaRangeValidator()]],
      PrixTTC : [, [Validators.required]],

    });
    this.setupFormListeners();
}

tvaRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value !== null && (value < 7 || value > 20)) {
      return { tvaOutOfRange: true }; // Erreur si hors de la plage
    }
    return null; // Pas d'erreur
  };
}

 // Écoute les changements pour recalculer le PrixHT
 setupFormListeners() {
  this.addServiceForm.valueChanges.subscribe((formValues) => {
    const { PrixTTC, TVA } = formValues;
    if (PrixTTC && TVA) {
      const PrixHT = PrixTTC / (1 + TVA / 100);
      this.addServiceForm.get('PrixHT')?.setValue(PrixHT.toFixed(3), { emitEvent: false });
    }
  });
}

loadServicesData(): void {
  this.ServiceService.getAllServices().subscribe(
    (Services: Service[]) => {
      this.existingDess = Services.map(e => e.Designation_Service);


      // Mettre à jour les validateurs des champs
      this.addServiceForm.get('Designation_Service')?.setValidators([
        Validators.required,
        this.uniqueValidator(this.existingDess, 'DesNotUnique')
      ]);
      this.addServiceForm.get('Designation_Service')?.updateValueAndValidity();

    },
    (error) => {
      console.error('Erreur lors du chargement des Services:', error);
    }
  );
}


  isFieldInvalid(field: string): boolean {
    const control = this.addServiceForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  uniqueValidator(existingValues: string[], errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return existingValues.includes(control.value) ? { [errorKey]: true } : null;
    };
  }


  save(): void {
    const formValue = { ...this.addServiceForm.value };
    console.log(this.addServiceForm.value)
    console.log(formValue)
    if (this.addServiceForm.valid) {
      this.ServiceService.addService(formValue).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err),
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
