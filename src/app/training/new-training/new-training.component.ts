import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TrainingService } from '../training.service';
import { Excercise } from '../excercise.model';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';
import { UIService } from 'src/app/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  @Output() trainingStart = new EventEmitter<void>();

  excercises: Excercise[] = [];

  isLoading = false;

  constructor(private trainingService: TrainingService,
              private uiService: UIService){}

  ngOnInit(): void {

    this.uiService.loadingStateEvent.subscribe(
      data => {
        this.isLoading = data
      }
    );

    this.fetchExcercises();

    this.trainingService.availableExEvent.subscribe(
      data => {
        this.excercises = data;
      }
    );
  }

  onStartTraining(form: NgForm){
    console.log("starting excercise")
    this.trainingService.startExcercise(form.value.excercise);
  }

  fetchExcercises(){
    this.trainingService.getAvaialbleExcercises();
  }
  

}
