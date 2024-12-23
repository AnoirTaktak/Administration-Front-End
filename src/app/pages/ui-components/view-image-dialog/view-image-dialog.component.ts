import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-image-dialog',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './view-image-dialog.component.html',
  styleUrls: ['./view-image-dialog.component.scss'],
})
export class ViewImageDialogComponent implements OnInit {
  fileType: 'pdf' | 'image' | null = null;
  safeUrl: SafeResourceUrl | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { file: any },
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.data.file) {
      this.loadFile(this.data.file);
    } else {
      console.error('Aucun fichier disponible.');
    }
  }

  // Méthode pour charger le fichier
  loadFile(base64Content: string): void {
    try {
      const mimeType = this.getMimeType(base64Content);
      console.log(mimeType)
      if (mimeType.includes('pdf')) {
        this.fileType = 'pdf';
      } else if (mimeType.includes('image')) {
        this.fileType = 'image';
      } else {
        this.fileType = null;
        console.error('Type de fichier non pris en charge.');
        return;
      }

      const fileUrl = `data:${mimeType};base64,${base64Content}`;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
    } catch (error) {
      console.error('Erreur lors du chargement du fichier :', error);
    }
  }

  // Méthode pour détecter le type MIME (simplifiée)
  getMimeType(base64Content: string): string {
    if (base64Content.startsWith('JVBER')) return 'application/pdf'; // PDF
    if (base64Content.startsWith('/9j/')) return 'image/jpeg'; // JPEG
    if (base64Content.startsWith('iVBOR')) return 'image/png'; // PNG
    if (base64Content.startsWith('R0lGOD')) return 'image/gif'; // GIF
    return '';
  }

  // Téléchargement du fichier
  downloadFile(): void {
    try {
      const mimeType =
        this.fileType === 'pdf' ? 'application/pdf' : 'image/png'; // Détecte le type MIME
      const byteCharacters = atob(this.data.file); // Décodage Base64
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: mimeType }); // Crée un Blob avec le type correct

      // Création d'un lien temporaire
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.fileType === 'pdf' ? 'document.pdf' : 'image.png'; // Nom du fichier
      link.click();

      // Nettoyage
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier :', error);
    }
  }

  printFile(): void {
    const mimeType = this.fileType === 'pdf' ? 'application/pdf' : 'image/png';
    const byteCharacters = atob(this.data.file); // Décodage Base64

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const printWindow = window.open(url, '_blank'); // Ouvrir dans une nouvelle fenêtre/onglet

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print(); // Lancer l'impression
        printWindow.onafterprint = () => {
          printWindow.close(); // Fermer la fenêtre après impression
        };
      };
    } else {
      console.error('Impossible d\'ouvrir la fenêtre d\'impression.');
    }
  }


}
