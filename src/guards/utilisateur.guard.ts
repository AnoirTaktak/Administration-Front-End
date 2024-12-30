import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';


@Injectable({
  providedIn: 'root',
})
export class RoleGuardUser implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const role = this.authService.getRole();

    // Vérifier si l'utilisateur a le rôle SuperAdmin
    if (this.authService.isUser() || this.authService.isAdmin() || this.authService.isSuperAdmin()) {
      return true;
    } else {
      this.router.navigate(['/ui-components/acces-denied']);
      return false;
    }
  }
}
