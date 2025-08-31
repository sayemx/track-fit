import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  baseUrl = environment.trackFIT_URL;
  constructor(private httpClient: HttpClient) { }

  getExcerciseUserRecommendations(userId: string) {
    return this.httpClient.get(`${this.baseUrl}/recommendations/excercise/user/${userId}`);
  }


}
