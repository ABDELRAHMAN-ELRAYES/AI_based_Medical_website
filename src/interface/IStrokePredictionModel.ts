export interface stroke_prediction_sample_input {
  gender: number;
  age: number;
  hypertension: number;
  heart_disease: number;
  ever_married: number;
  work_type: number;
  avg_glucose_level: number;
  bmi: number;
  smoking_status: number;
}
export const strokePredictionFeatureNames: (keyof stroke_prediction_sample_input)[] =
  [
    'gender',
    'age',
    'hypertension',
    'heart_disease',
    'ever_married',
    'work_type',
    'avg_glucose_level',
    'bmi',
    'smoking_status',
  ];
