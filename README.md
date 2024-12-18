# IYA-MED

IYA-MED is a web-based healthcare platform that leverages AI models to predict diseases based on user inputs. This project aims to assist medical professionals and patients by providing quick and accurate preliminary diagnoses for various medical conditions.

---

## Features

- **AI-Powered Predictions**: Predict diseases with high accuracy using trained machine learning models.
  - Brain Tumor Detection
  - Heart Disease Prediction
  - Breast Cancer Detection
  - Chest X-Ray Analysis
  - Stroke Prediction
- **User-Friendly Interface**: Intuitive design for easy navigation and input of medical data.
- **Visualization**: Display results and predictions with detailed visual insights.
- **Downloadable Reports**: Users can download the prediction results and tips as a PDF file.
- **Tips Based on Predictions**: The system provides health tips based on the prediction results through integration with the Gemini API.
- **Email Alerts**: Automatically send emails to the patient's relatives if the prediction indicates an infection or serious condition.
- **History Management**: Patients can download their entire prediction history for record-keeping.
- **Doctor Suggestions**: View recommended doctors based on the predicted disease to help patients find specialized care.
- **Google Login**: Users can log in using their Google accounts via OAuth 2.0.
- **Secure Data Handling**: Ensures the privacy and security of user-submitted medical data.

---

## Tech Stack

### Frontend
- **Pug**: Template engine for dynamic HTML generation.
- **CSS**: For styling and responsive design.
- **Tailwind CSS**: Utility-first CSS framework for modern designs.

### Backend
- **TypeScript**: Strongly typed language for better code quality and maintainability.
- **Express.js**: Web framework for building the backend API.
- **Node.js**: Server-side runtime environment.
- **Prisma**: ORM for database management.
- **ONNX Runtime**: Used to connect and serve AI models efficiently.

### AI Models
- **Python**: For training and running machine learning models.
- **TensorFlow**: Frameworks used to build and train the predictive models.
- **Scikit-learn**: For additional preprocessing and model evaluation.
- **ONNX**: Format for exporting and deploying models with high performance.

### Database
- **PostgreSQL**: Relational database for storing user inputs and predictions.

### Tooling
- **Prettier**: Code formatter for consistent styling.
- **PostCSS**: For CSS processing.

---

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ABDELRAHMAN-ELRAYES/IYA-MED.git
   cd IYA-MED
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Configure your PostgreSQL connection in the `.env` file.
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```

4. Configure Google OAuth:
   - Set up a Google and enable the OAuth 2.0.
   - Add your client ID and secret to the `.env` file.

5. Start the development server:
   ```bash
   npm run start:dev
   ```
---

## Usage

1. Open the web application in your browser.
2. Log in using your Google account via OAuth 2.0.
3. Select the medical condition you want to predict:
   - Brain Tumor
   - Heart Disease
   - Breast Cancer
   - Chest X-Ray
   - Stroke
4. Input the required medical data.
5. Click "Get Result" to get results.
6. View the predictions and visual insights.
7. Download the detailed prediction report as a PDF.
8. Explore health tips and recommended doctors based on the prediction results.
9. Access and download your prediction history if needed.



Thank you for visiting IYA-MED Repository! Your feedback is greatly appreciated.
