import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';


@Injectable({
  providedIn: 'root',
})
export class RoleGuardSuperAdmin implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const role = this.authService.getRole();

    // Vérifier si l'utilisateur a le rôle SuperAdmin
    if (role === 'SuperAdmin') {
      return true;  // L'utilisateur a accès à la page
    } else {
      // Si l'utilisateur n'a pas le rôle SuperAdmin, rediriger vers une autre page (par exemple, la page d'accueil)
      this.router.navigate(['/ui-components/access-denied']);
      return false;
    }
  }
}
