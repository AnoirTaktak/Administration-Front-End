import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';


@Injectable({
  providedIn: 'root',
})
export class RoleGuardAdmin implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const role = this.authService.getRole();

    if (this.authService.isAdmin() || this.authService.isSuperAdmin()) {
      return true;
    } else {
      this.router.navigate(['/ui-components/access-denied']);
      return false;
    }
  }
}
