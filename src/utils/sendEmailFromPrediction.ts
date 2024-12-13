import { NextFunction, Request, Response } from 'express';
import { emailOptions, sendEmail, transporter } from './Email';

export const sendEmailBasedOnPredictionResult = (
  modelName: string,
  relativeEmail: string,
  patientName: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log('email sent');
    emailOptions.subject = `IYA MED | ${modelName} Test Result ✔`;
    emailOptions.to = relativeEmail;
    emailOptions.text = `We are contacting you regarding your relative, ${patientName}, who has undergone a ${modelName} test. The result indicates that they have tested positive for an infection. We strongly recommend that you arrange for a detailed examination and seek consultation with a healthcare professional as soon as possible.`;
    emailOptions.html = `<p>We are contacting you regarding your relative, ${patientName}, who has undergone a ${modelName} test. The result indicates that they have tested positive for an infection. We strongly recommend that you arrange for a detailed examination and seek consultation with a healthcare professional as soon as possible.</p>`;
    await sendEmail(transporter, emailOptions);
  };
};
