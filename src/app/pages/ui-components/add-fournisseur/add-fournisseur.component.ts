import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { Fournisseur } from 'src/Models/fournisseur';

@Component({
  selector: 'app-add-fournisseur',
  standalone:true,
  imports:[
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-fournisseur.component.html',
  styleUrl: './add-fournisseur.component.scss'
})
export class AddFournisseurComponent {
  addFournisseurForm!: FormGroup;
  existingMFs: any[] = [];
  existingRSs: any[] = [];
  isDateFinDisabled = false;

  constructor(
    public dialogRef: MatDialogRef<AddFournisseurComponent>,
    private fb: FormBuilder,
    private FournisseurService: FournisseurService
  ) {}

  ngOnInit(): void {

    this.loadFournisseursData();
    this.addFournisseurForm = this.fb.group({
      MF_Fournisseur: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{7}[A-Za-z]{3}[0-9]{3}$/),
          this.uniqueValidator(this.existingMFs, 'MFNotUnique'),
        ],
      ],
      RaisonSociale_Fournisseur: [
        '',
        [
          Validators.required,
          this.uniqueValidator(this.existingRSs, 'RSNotUnique'),
        ],
      ],
      Tel_Fournisseur: ['', [Validators.required, Validators.pattern(/^\+216\d{8}$|^\d{8}$/)]],
      Adresse_Fournisseur: ['', [Validators.required]],
      Type_Fournisseur: ['', Validators.required],
      Email_Fournisseur : ['', [Validators.required, Validators.email]],

    });
}

loadFournisseursData(): void {
  this.FournisseurService.getAllFournisseurs().subscribe(
    (Fournisseurs: Fournisseur[]) => {
      this.existingMFs = Fournisseurs.map(e => e.MF_Fournisseur);
      this.existingRSs = Fournisseurs.map(e => e.RaisonSociale_Fournisseur);

      // Mettre à jour les validateurs des champs
      this.addFournisseurForm.get('MF_Fournisseur')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{7}[A-Za-z]{3}[0-9]{3}$/),
        this.uniqueValidator(this.existingMFs, 'MFNotUnique')
      ]);
      this.addFournisseurForm.get('CIN_Fournisseur')?.updateValueAndValidity();

      this.addFournisseurForm.get('RaisonSociale_Fournisseur')?.setValidators([
        Validators.required,
        this.uniqueValidator(this.existingRSs, 'RSNotUnique')
      ]);
      this.addFournisseurForm.get('RaisonSociale_Fournisseur')?.updateValueAndValidity();
    },
    (error) => {
      console.error('Erreur lors du chargement des Fournisseurs:', error);
    }
  );
}


  isFieldInvalid(field: string): boolean {
    const control = this.addFournisseurForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  uniqueValidator(existingValues: string[], errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return existingValues.includes(control.value) ? { [errorKey]: true } : null;
    };
  }


  save(): void {
    const formValue = { ...this.addFournisseurForm.value };
    console.log(this.addFournisseurForm.value)
    console.log(formValue)
    if (this.addFournisseurForm.valid) {
      this.FournisseurService.addFournisseur(formValue).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err),
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
