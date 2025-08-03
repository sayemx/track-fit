import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from './training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy{
  
  ongoingTraining = false;

  excerciseSubscription: Subscription = new Subscription();

  constructor(private trainingService: TrainingService){}

  ngOnInit(): void {
    this.trainingService.excerciseChanged.subscribe(
      excercise => {
        if(excercise){
          this.ongoingTraining = true;
        }else{
          this.ongoingTraining = false;
        }
      }
    );
  }
  ngOnDestroy(): void {
    this.excerciseSubscription.unsubscribe();
  }


}
