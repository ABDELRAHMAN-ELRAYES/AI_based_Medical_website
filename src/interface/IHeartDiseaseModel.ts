export interface IHeartDiseaseFeatures {
  Age: number;
  Sex: number;
  ChestPainType: number;
  RestingBP: number;
  Cholesterol: number;
  FastingBS: number;
  RestingECG: number;
  MaxHR: number;
  ExerciseAngina: number;
  Oldpeak: number;
  ST_Slope: number;
  NumMajorVessels: number;
  Thal: number;
}

export const heartDiseaseFeatureNames: (keyof IHeartDiseaseFeatures)[] = [
  'Age',
  'Sex',
  'ChestPainType',
  'RestingBP',
  'Cholesterol',
  'FastingBS',
  'RestingECG',
  'MaxHR',
  'ExerciseAngina',
  'Oldpeak',
  'ST_Slope',
  'NumMajorVessels',
  'Thal',
];
