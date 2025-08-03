import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output() sidenavClode = new EventEmitter<void>();

  isAuth: boolean = false;
  authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService){}


  ngOnInit(): void {
    
    this.authSubscription = this.authService.authChange.subscribe(
      data => {
        this.isAuth = data;
      }
    );
    
  }
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }


  closeSidenav(){
    this.sidenavClode.emit();
  }

  onLogout(){
    this.closeSidenav();
    this.authService.logout();
  }

}
