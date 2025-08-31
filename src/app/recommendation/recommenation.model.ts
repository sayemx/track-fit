export interface DetailedRecommendationResponse {
  id: string;
  activityId: string;
  userId: string;
  activityType: string;
  duration: number,
  caloryBurned: number,
  summary: string;
  effortLevel: string;
  consistency: string;
  calorieEfficiency: string;
  keyObservations: string[];
  fitnessAdvice: string[];
  nutritionAdvice: string[];
  recoveryTips: string[];
  improvements: string[];
  suggestions: string[];
  trend: string;
  nextBestActivity: string;
  safety: string[];
  proTip: string;
  createdAt: string; 
}