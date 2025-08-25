# Medical Doctor Recommendation API

This Python API analyzes medical reports (from Gemini AI) and provides personalized doctor recommendations based on a CSV database of medical specialists.

## Features

- **Medical Analysis**: Extracts medical conditions, symptoms, and keywords from text
- **Doctor Matching**: Scores doctors based on specialty relevance and experience
- **Smart Recommendations**: Provides top 5 doctor matches with detailed information
- **Urgency Assessment**: Determines consultation priority levels
- **Comprehensive Output**: Includes contact details, match scores, and reasoning

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the API Server
```bash
python run_api.py
```

The API will be available at `http://localhost:8000`

### 3. Test the API
```bash
python test_api.py
```

## API Endpoints

### Health Check
- **GET** `/health` - Check if API is running

### Doctor Recommendations
- **POST** `/analyze-gemini-response` - Analyze Gemini response and get doctor recommendations

#### Request Body:
```json
{
  "gemini_response": "Medical analysis text from Gemini AI...",
  "user_prompt": "User's original question"
}
```

#### Response:
```json
{
  "success": true,
  "medical_analysis": {
    "extracted_info": {...},
    "condition_analysis": {...},
    "urgency_level": "High/Medium/Low"
  },
  "doctor_recommendations": [
    {
      "name": "Dr. Name",
      "specialty": "Cardiology",
      "years_experience": 12,
      "hospital": "Hospital Name",
      "address": "Address",
      "contact": {
        "mobile": "+91 1234567890",
        "email": "doctor@example.com"
      },
      "scores": {
        "specialty_match": 0.8,
        "experience": 0.7,
        "total": 0.78
      },
      "why_recommended": "Reason for recommendation"
    }
  ],
  "summary": {
    "top_specialties_needed": ["Cardiology", "Endocrinology"],
    "urgency": "High",
    "next_steps": ["Schedule consultation..."]
  }
}
```

## Integration with Chatbot

The chatbot.js file now automatically:
1. Sends PDF content to Gemini AI for analysis
2. Receives medical analysis from Gemini
3. Sends Gemini response to this Python API
4. Gets personalized doctor recommendations
5. Displays formatted results to the user

## CSV Data Structure

The `doctors.csv` file should contain:
- Specialty
- Name
- Address
- Email
- Mobile
- Years_in_Practice
- Hospital_Affiliation

## Usage Example

1. **Start the API server**: `python run_api.py`
2. **Use the chatbot**: Upload a medical PDF and ask questions
3. **Get recommendations**: The system will automatically provide doctor matches

## Troubleshooting

- **Port 8000 already in use**: Change the port in `run_api.py`
- **CSV not found**: Ensure `doctors.csv` is in the same directory
- **CORS issues**: The API allows all origins for development

## Development

- **Main logic**: `main.py` contains the `UniversalMedicalAnalyzer` class
- **API endpoints**: FastAPI routes for web integration
- **Data processing**: Pandas for CSV handling and analysis
