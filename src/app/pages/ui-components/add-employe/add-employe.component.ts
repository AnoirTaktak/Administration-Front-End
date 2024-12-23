import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeService } from 'src/app/services/employe/employe.service';
import { Employe } from 'src/Models/employe';

@Component({
  standalone:true,
  imports:[
    ReactiveFormsModule,
    CommonModule,
  ],
  selector: 'app-add-employe',
  templateUrl: './add-employe.component.html',
  styleUrls: ['./add-employe.component.scss'],
})
export class AddEmployeComponent {
  addEmployeForm!: FormGroup;
  existingCINs: any[] = [];
  existingCNSSs: any[] = [];
  existingNoms: any[] = [];
  isDateFinDisabled = false;

  constructor(
    public dialogRef: MatDialogRef<AddEmployeComponent>,
    private fb: FormBuilder,
    private employeService: EmployeService
  ) {}

  ngOnInit(): void {

    this.loadEmployesData();
    this.addEmployeForm = this.fb.group({
      Nom_Employe: ['', [Validators.required,this.uniqueValidator(this.existingNoms, 'nomNotUnique'),]],
      Poste_Employe: ['', Validators.required],
      CIN_Employe: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{8}$/),
          this.uniqueValidator(this.existingCINs, 'cinNotUnique'),
        ],
      ],
      CNSS_Employe: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          this.uniqueValidator(this.existingCNSSs, 'cnssNotUnique'),
        ],
      ],
      Tel_Employe: ['', [Validators.required, Validators.pattern(/^\+216\d{8}$|^\d{8}$/)]],
      Salaire: ['', [Validators.required, Validators.min(1)]],
      TypeContrat: [null, Validators.required],
      Email_Employe: ['', [Validators.required, Validators.email]],
      DateDebut: ['', Validators.required],
      DateFin: ['', this.dateRangeValidator()],
    });


   // Surveiller les changements de 'TypeContrat' et désactiver 'DateFin' si CDI est sélectionné
  this.addEmployeForm.get('TypeContrat')?.valueChanges.subscribe((value) => {
    if (value === '1') { // CDI
      this.addEmployeForm.get('DateFin')?.disable(); // Désactive le champ DateFin
      this.addEmployeForm.get('DateFin')?.clearValidators(); // Enlève la validation de DateFin
      this.addEmployeForm.get('DateFin')?.updateValueAndValidity();
    } else {
      this.addEmployeForm.get('DateFin')?.enable(); // Active le champ DateFin
      this.addEmployeForm.get('DateFin')?.setValidators(this.dateRangeValidator()); // Restaure la validation de DateFin
      this.addEmployeForm.get('DateFin')?.updateValueAndValidity();
    }
  });
}

loadEmployesData(): void {
  this.employeService.getAllEmployes().subscribe(
    (employes: Employe[]) => {
      this.existingCINs = employes.map(e => e.CIN_Employe);
      this.existingCNSSs = employes.map(e => e.CNSS_Employe);
      this.existingNoms = employes.map(e=>e.Nom_Employe);

      // Mettre à jour les validateurs des champs
      this.addEmployeForm.get('CIN_Employe')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{8}$/),
        this.uniqueValidator(this.existingCINs, 'cinNotUnique')
      ]);
      this.addEmployeForm.get('CIN_Employe')?.updateValueAndValidity();

      this.addEmployeForm.get('Nom_Employe')?.setValidators([
        Validators.required,
        this.uniqueValidator(this.existingNoms, 'nomNotUnique')
      ]);
      this.addEmployeForm.get('Nom_Employe')?.updateValueAndValidity();

      this.addEmployeForm.get('CNSS_Employe')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d+$/),
        this.uniqueValidator(this.existingCNSSs, 'cnssNotUnique')
      ]);
      this.addEmployeForm.get('CNSS_Employe')?.updateValueAndValidity();
    },
    (error) => {
      console.error('Erreur lors du chargement des employés:', error);
    }
  );
}


  isFieldInvalid(field: string): boolean {
    const control = this.addEmployeForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  uniqueValidator(existingValues: string[], errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return existingValues.includes(control.value) ? { [errorKey]: true } : null;
    };
  }

  dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = this.addEmployeForm?.get('DateDebut')?.value;
      const endDate = control.value;
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        return { invalidRange: true };
      }
      return null;
    };
  }

  save(): void {
    const formValue = { ...this.addEmployeForm.value };
  formValue.TypeContrat = +formValue.TypeContrat;
    console.log(this.addEmployeForm.value)
    console.log(formValue)
    if (this.addEmployeForm.valid) {
      this.employeService.addEmploye(formValue).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err),
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
