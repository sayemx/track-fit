import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  maxDate: Date = new Date();

  isLoading = false;
  
  constructor(private authSerive: AuthService,
              private uiService: UIService){}

  ngOnInit(): void {

    this.uiService.loadingStateEvent.subscribe(
      data => {
        this.isLoading = data;
      }
    );
    
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }


  onSubmit(form: NgForm){
    console.log(form);

    this.authSerive.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }

}
