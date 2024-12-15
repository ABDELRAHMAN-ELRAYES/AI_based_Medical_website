import { NextFunction, Request, Response } from 'express';
import { emailOptions, sendEmail, transporter } from './Email';

export const sendEmailBasedOnPredictionResult = (
  modelName: string,
  relativeEmail: string,
  patientName: string,
  predictionDate: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log('email sent');
    emailOptions.subject = `IYA MED | ${modelName} Test Result ✔`;
    emailOptions.to = relativeEmail;
    emailOptions.text = `We are contacting you regarding your relative, ${patientName}, who has undergone a ${modelName} test in ${predictionDate}. The result indicates that they have tested positive for an infection. We strongly recommend that you arrange for a detailed examination and seek consultation with a healthcare professional as soon as possible.`;
    emailOptions.html = ` <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #2d87f0;
          font-size: 24px;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .highlight {
          font-weight: bold;
          color: #e74c3c;
        }
        .footer {
          font-size: 14px;
          color: #888;
          margin-top: 30px;
          text-align: center;
        }
        .footer a {
          color: #2d87f0;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Important Medical Test Result</h1>
        <p>Dear Sir/Madam,</p>
        <p>We are contacting you regarding your relative, <span class="highlight">${patientName}</span>, who has undergone a <span class="highlight">${modelName}</span> test on <span class="highlight">${predictionDate}</span>. The result indicates that they have tested positive for an infection.</p>
        <p>We strongly recommend that you arrange for a detailed examination and seek consultation with a healthcare professional as soon as possible.</p>
        <p>Thank you for your attention to this important matter.</p>
        <div class="footer">
          <p>If you have any questions, please feel free to <a href="mailto:support@example.com">contact us</a>.</p>
        </div>
      </div>
    </body>
  </html>
`;
    await sendEmail(transporter, emailOptions);
  };
};
