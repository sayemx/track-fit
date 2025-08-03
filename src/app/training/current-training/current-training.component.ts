import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop.training.component';
import { TrainingService } from '../training.service';
import { Excercise } from '../excercise.model';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress: number = 0;
  timer: any;

  private runningExcercise: any;

  constructor(private dialog: MatDialog, private trainingService: TrainingService){}

  ngOnInit(): void {

    this.runningExcercise = this.trainingService.getRunningExcercise();
    this.startOrResumeTimer()

  }

  startOrResumeTimer(){
    const step = this.runningExcercise?.duration / 100 * 1000;
     this.timer = setInterval(() => {
        this.progress = this.progress + 5;
        if(this.progress >= 100) {
          clearInterval(this.timer);
          this.trainingService.completeExcercise();
        }
      }, step);
  }


  stopTraining(){
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        console.log(res)
        if(res) {
          // this.trainingExit.emit();
          this.trainingService.cancelExcercise(this.progress);
        }else{
          this.startOrResumeTimer()
        }
      }
    );
  }

}
