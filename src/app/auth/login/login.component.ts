import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  isLoading = false;

  constructor(private authService: AuthService,
              private uiService: UIService){}

  ngOnInit(): void {
    
    this.uiService.loadingStateEvent.subscribe(
      data => this.isLoading = data
    );

    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.email, Validators.required]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      })
      
    });

  }

  onSubmit(){
      console.log(this.loginForm);

      // this.authService.login({
      //   email: this.loginForm.value.email,
      //   password: this.loginForm.value.password
      // });
  }

}

