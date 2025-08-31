import { Component, OnInit } from '@angular/core';
import { RecommendationService } from './recommendation-service.service';
import { DetailedRecommendationResponse } from './recommenation.model';
import { TrainingService } from '../training/training.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit{
  
  recommendation?: DetailedRecommendationResponse;


  constructor(private recommendationService: RecommendationService,
              private trainingService: TrainingService){}
  
  ngOnInit(): void {

    // this.trainingService.newRcom.subscribe(
    //   data => {
    //     console.log('new recommendations fetching');
    //     this.getRecommendations()
    //   }
    // );

    this.getRecommendations();

    
  }


  getRecommendations() {
    this.recommendationService.getExcerciseUserRecommendations('user123').subscribe({
      next: (response: any) => {
        // console.log(response);
        this.recommendation = response[0];
        console.log(this.recommendation);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
