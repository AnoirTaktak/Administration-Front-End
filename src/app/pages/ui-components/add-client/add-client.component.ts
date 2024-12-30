import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientService } from 'src/app/services/client/client.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Client } from 'src/Models/client';

@Component({
  selector: 'app-add-client',
  standalone:true,
  imports:[
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {
  addClientForm!: FormGroup;
  existingMFs: any[] = [];
  existingRSs: any[] = [];
  isDateFinDisabled = false;

  constructor(
    public dialogRef: MatDialogRef<AddClientComponent>,
    private fb: FormBuilder,
    private ClientService: ClientService,private authService: LoginService
  ) {}

  ngOnInit(): void {

    this.loadClientsData();
    this.addClientForm = this.fb.group({
      MF_Client: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{7}[A-Za-z]{3}[0-9]{3}$/),
          this.uniqueValidator(this.existingMFs, 'MFNotUnique'),
        ],
      ],
      RS_Client: [
        '',
        [
          Validators.required,
          this.uniqueValidator(this.existingRSs, 'RSNotUnique'),
        ],
      ],
      Tel_Client: ['', [Validators.required, Validators.pattern(/^\+216\d{8}$|^\d{8}$/)]],
      Adresse_Client: ['', [Validators.required]],
      Type_Client: [null, Validators.required],
      Email_Client : ['', [Validators.required, Validators.email]],

    });
}

loadClientsData(): void {
  this.ClientService.getAllClients().subscribe(
    (Clients: Client[]) => {
      this.existingMFs = Clients.map(e => e.MF_Client);
      this.existingRSs = Clients.map(e => e.RS_Client);

      // Mettre à jour les validateurs des champs
      this.addClientForm.get('MF_Client')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{7}[A-Za-z]{3}[0-9]{3}$/),
        this.uniqueValidator(this.existingMFs, 'MFNotUnique')
      ]);
      this.addClientForm.get('MF_Client')?.updateValueAndValidity();

      this.addClientForm.get('RS_Client')?.setValidators([
        Validators.required,
        this.uniqueValidator(this.existingRSs, 'RSNotUnique')
      ]);
      this.addClientForm.get('RS_Client')?.updateValueAndValidity();
    },
    (error) => {
      console.error('Erreur lors du chargement des Clients:', error);
    }
  );
}


  isFieldInvalid(field: string): boolean {
    const control = this.addClientForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  uniqueValidator(existingValues: string[], errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return existingValues.includes(control.value) ? { [errorKey]: true } : null;
    };
  }


  save(): void {
    const formValue = { ...this.addClientForm.value };
  formValue.Type_Client = +formValue.Type_Client;
    console.log(this.addClientForm.value)
    console.log(formValue)
    if (this.addClientForm.valid) {
      this.ClientService.addClient(formValue).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err),
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
