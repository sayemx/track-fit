import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() sidenavToggle = new EventEmitter<void>();

  isAuth: boolean = false;
  authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService){}

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(
      data => {
        this.isAuth = data;
      }
    );
  }

  onToggleSidenav(){
    this.sidenavToggle.emit()
  }

  onLogout(){
    this.authService.logout();
  }
}
