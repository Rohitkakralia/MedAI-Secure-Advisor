import pandas as pd
import json
import re
from typing import List, Dict, Tuple, Any
from dataclasses import dataclass
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

@dataclass
class MedicalCondition:
    name: str
    keywords: List[str]
    primary_specialties: List[str]
    secondary_specialties: List[str]
    urgency_level: str

class UniversalMedicalAnalyzer:
    def __init__(self):
        # Comprehensive medical condition database
        self.medical_conditions = self._initialize_conditions()
        
        # Specialty expertise mapping
        self.specialty_expertise = {
            "Hematology": ["blood", "anemia", "hemoglobin", "platelet", "leukemia", "lymphoma", "bleeding", "mchc", "mcv", "mch", "rbc", "wbc", "lymphocyte", "monocyte", "neutrophil", "eosinophil", "basophil", "complete blood count", "cbc", "hematology", "hematological"],
            "Internal Medicine": ["general", "internal medicine", "primary care", "family medicine", "general physician", "blood", "infection", "fever", "fatigue", "weakness"],
            "Cardiology": ["heart", "cardiovascular", "blood pressure", "chest pain", "cardiac", "ecg", "ekg", "cholesterol", "arrhythmia"],
            "Neurology": ["brain", "neurological", "seizure", "headache", "migraine", "stroke", "nervous system", "memory", "confusion"],
            "Pediatrics": ["child", "infant", "pediatric", "vaccination", "growth", "development"],
            "Orthopedics": ["bone", "joint", "fracture", "muscle", "skeletal", "arthritis", "spine", "ligament"],
            "Dermatology": ["skin", "rash", "acne", "dermatitis", "allergy", "eczema", "psoriasis", "mole"],
            "ENT": ["ear", "nose", "throat", "sinus", "hearing", "tonsils", "voice", "respiratory infection"],
            "Ophthalmology": ["eye", "vision", "sight", "retina", "glaucoma", "cataract", "visual"],
            "Psychiatry": ["mental", "depression", "anxiety", "stress", "psychiatric", "mood", "behavioral", "panic"],
            "Gastroenterology": ["stomach", "digestive", "liver", "intestine", "bowel", "gastric", "hepatic", "abdominal"],
            "Pulmonology": ["lung", "respiratory", "breathing", "asthma", "pneumonia", "cough", "chest", "pulmonary"],
            "Endocrinology": ["diabetes", "thyroid", "hormone", "endocrine", "insulin", "glucose", "metabolic"],
            "Rheumatology": ["arthritis", "joint pain", "autoimmune", "inflammatory", "lupus", "fibromyalgia"],
            "Oncology": ["cancer", "tumor", "malignant", "chemotherapy", "radiation", "oncology", "neoplasm"],
            "Urology": ["kidney", "bladder", "urinary", "prostate", "urological", "renal"],
            "Gynecology": ["gynecological", "menstrual", "reproductive", "ovarian", "uterine", "pregnancy"],
            "Infectious Disease": ["infection", "bacterial", "viral", "sepsis", "fever", "antibiotics"],
            "Emergency Medicine": ["emergency", "trauma", "acute", "critical", "urgent", "life-threatening"]
        }
        
        # Blood test parameter mappings
        self.blood_parameter_specialties = {
            "hemoglobin": ["Hematology", "Cardiology", "Gastroenterology"],
            "white_blood_cells": ["Hematology", "Infectious Disease", "ENT"],
            "platelets": ["Hematology", "Cardiology"],
            "glucose": ["Endocrinology", "Cardiology"],
            "cholesterol": ["Cardiology", "Endocrinology"],
            "liver_enzymes": ["Gastroenterology", "Hepatology"],
            "kidney_function": ["Nephrology", "Urology"],
            "thyroid": ["Endocrinology"],
            "cardiac_markers": ["Cardiology", "Emergency Medicine"]
        }

    def _initialize_conditions(self) -> List[MedicalCondition]:
        """Initialize comprehensive medical conditions database"""
        return [
            MedicalCondition("Cardiovascular Disease", 
                           ["heart", "cardiac", "cardiovascular", "blood pressure", "chest pain"],
                           ["Cardiology"], ["ENT", "Pulmonology"], "High"),
            
            MedicalCondition("Respiratory Infection",
                           ["respiratory", "lung", "breathing", "cough", "pneumonia"],
                           ["Pulmonology", "ENT"], ["Infectious Disease"], "Medium"),
            
            MedicalCondition("Diabetes",
                           ["diabetes", "glucose", "insulin", "blood sugar"],
                           ["Endocrinology"], ["Cardiology", "Ophthalmology"], "Medium"),
            
            MedicalCondition("Mental Health",
                           ["stress", "anxiety", "depression", "mental", "psychiatric"],
                           ["Psychiatry"], ["Neurology"], "Medium"),
            
            MedicalCondition("Gastrointestinal Issues",
                           ["stomach", "digestive", "abdominal", "liver", "intestine"],
                           ["Gastroenterology"], ["Infectious Disease"], "Medium"),
            
            MedicalCondition("Blood Disorders",
                           ["blood", "anemia", "hemoglobin", "platelet", "lymphocyte"],
                           ["Hematology"], ["Cardiology", "Gastroenterology"], "High"),
            
            MedicalCondition("Neurological Conditions",
                           ["brain", "neurological", "seizure", "headache", "stroke"],
                           ["Neurology"], ["Psychiatry"], "High"),
            
            MedicalCondition("Infectious Diseases",
                           ["infection", "bacterial", "viral", "fever", "sepsis"],
                           ["Infectious Disease", "ENT"], ["Pulmonology"], "High"),
            
            MedicalCondition("Autoimmune Disorders",
                           ["autoimmune", "inflammatory", "arthritis", "lupus"],
                           ["Rheumatology"], ["Dermatology"], "Medium"),
            
            MedicalCondition("Cancer/Oncology",
                           ["cancer", "tumor", "malignant", "oncology", "neoplasm"],
                           ["Oncology"], ["Surgery", "Radiology"], "High")
        ]

    def extract_medical_info(self, report_data: Any) -> Dict:
        """Universal extraction of medical information from various report formats"""
        medical_info = {
            "patient_info": {},
            "conditions": [],
            "abnormal_parameters": [],
            "symptoms": [],
            "keywords": [],
            "urgency_indicators": []
        }
        
        # Handle different input formats
        if isinstance(report_data, dict):
            medical_info = self._extract_from_dict(report_data, medical_info)
        elif isinstance(report_data, str):
            medical_info = self._extract_from_text(report_data, medical_info)
        
        return medical_info

    def _extract_from_dict(self, data: Dict, medical_info: Dict) -> Dict:
        """Extract information from structured dictionary data"""
        def recursive_extract(obj, path=""):
            if isinstance(obj, dict):
                for key, value in obj.items():
                    current_path = f"{path}.{key}" if path else key
                    
                    # Extract patient information
                    if "patient" in key.lower() or "name" in key.lower():
                        if isinstance(value, dict):
                            medical_info["patient_info"].update(value)
                        elif isinstance(value, str):
                            medical_info["patient_info"][key] = value
                    
                    # Extract conditions and diseases
                    if any(term in key.lower() for term in ["disease", "condition", "diagnosis", "predicted"]):
                        if isinstance(value, str):
                            medical_info["conditions"].append(value)
                        elif isinstance(value, dict) and "most_probable" in value:
                            medical_info["conditions"].append(value["most_probable"])
                    
                    # Extract abnormal parameters
                    if "abnormal" in key.lower() or "parameters" in key.lower():
                        if isinstance(value, list):
                            medical_info["abnormal_parameters"].extend(value)
                    
                    # Extract symptoms and keywords
                    if any(term in key.lower() for term in ["symptom", "keyword", "reason"]):
                        if isinstance(value, str):
                            medical_info["keywords"].extend(self._extract_keywords(value))
                    
                    recursive_extract(value, current_path)
            
            elif isinstance(obj, list):
                for item in obj:
                    recursive_extract(item, path)
        
        recursive_extract(data)
        return medical_info

    def _extract_from_text(self, text: str, medical_info: Dict) -> Dict:
        """Extract information from free text"""
        # Extract keywords using regex patterns
        medical_keywords = []
        
        # Enhanced medical terms pattern for better hematology detection
        medical_patterns = [
            # Blood-related terms
            r'\b(blood|hematology|hematological|hemoglobin|hemoglobin|mchc|mcv|mch|rbc|wbc|platelet|lymphocyte|monocyte|neutrophil|eosinophil|basophil)\b',
            r'\b(complete blood count|cbc|blood count|blood test|blood analysis)\b',
            r'\b(anemia|leukemia|lymphoma|thrombocytopenia|leukopenia|neutropenia)\b',
            
            # General medical terms
            r'\b(diabetes|hypertension|cancer|infection|pneumonia|asthma)\b',
            r'\b(high|low|elevated|decreased|abnormal|normal|within range)\s+(\w+)',
            r'\b(heart|lung|kidney|liver|brain)\s+(\w+)',
            r'\b(\w+)\s+(deficiency|disorder|disease|syndrome)\b',
            
            # Test parameters
            r'\b(mchc|mcv|mch|rbc|wbc|hgb|hct|rdw|mpv|pct|pdw)\b',
            r'\b(lymphocyte|monocyte|neutrophil|eosinophil|basophil|band|segmented)\b'
        ]
        
        for pattern in medical_patterns:
            matches = re.findall(pattern, text.lower())
            medical_keywords.extend([match if isinstance(match, str) else ' '.join(match) for match in matches])
        
        # Extract specific conditions based on context
        conditions = []
        text_lower = text.lower()
        
        # Hematology-specific condition detection
        if any(term in text_lower for term in ['hematology', 'blood count', 'cbc', 'complete blood count', 'blood test', 'blood analysis']):
            if any(term in text_lower for term in ['high mchc', 'elevated mchc', 'mchc high', 'mchc elevated']):
                conditions.append("High MCHC")
            if any(term in text_lower for term in ['low lymphocyte', 'decreased lymphocyte', 'lymphocyte low', 'lymphocyte decreased']):
                conditions.append("Low Lymphocyte Count")
            if any(term in text_lower for term in ['low monocyte', 'decreased monocyte', 'monocyte low', 'monocyte decreased']):
                conditions.append("Low Monocyte Count")
            if any(term in text_lower for term in ['anemia', 'low hemoglobin', 'hemoglobin low']):
                conditions.append("Anemia")
            if any(term in text_lower for term in ['leukopenia', 'low white blood cells', 'white blood cells low']):
                conditions.append("Leukopenia")
            
            # Add general hematology condition if blood-related terms are found
            if any(term in text_lower for term in ['mchc', 'lymphocyte', 'monocyte', 'hemoglobin', 'platelet', 'rbc', 'wbc']):
                conditions.append("Blood Test Abnormalities")
        
        # General condition detection
        if any(term in text_lower for term in ['diabetes', 'glucose', 'blood sugar']):
            conditions.append("Diabetes")
        if any(term in text_lower for term in ['hypertension', 'high blood pressure']):
            conditions.append("Hypertension")
        if any(term in text_lower for term in ['infection', 'bacterial', 'viral']):
            conditions.append("Infection")
        
        medical_info["keywords"] = list(set(medical_keywords))
        medical_info["conditions"] = conditions
        
        return medical_info

    def _extract_keywords(self, text: str) -> List[str]:
        """Extract medical keywords from text"""
        keywords = []
        all_keywords = []
        
        # Flatten all specialty keywords
        for specialty_kw in self.specialty_expertise.values():
            all_keywords.extend(specialty_kw)
        
        # Add condition keywords
        for condition in self.medical_conditions:
            all_keywords.extend(condition.keywords)
        
        # Find matching keywords in text
        text_lower = text.lower()
        for keyword in set(all_keywords):
            if keyword in text_lower:
                keywords.append(keyword)
        
        return keywords

    def analyze_condition(self, medical_info: Dict) -> Dict:
        """Analyze medical condition and determine best specialties"""
        analysis = {
            "primary_conditions": [],
            "recommended_specialties": {},
            "urgency_level": "Medium",
            "confidence_scores": {}
        }
        
        all_keywords = medical_info["keywords"] + medical_info["conditions"]
        all_keywords.extend([param.get("parameter", "") if isinstance(param, dict) else str(param) 
                           for param in medical_info["abnormal_parameters"]])
        
        # Score each specialty based on keyword matches
        specialty_scores = {}
        for specialty, keywords in self.specialty_expertise.items():
            score = 0
            matches = []
            
            for keyword in keywords:
                for medical_keyword in all_keywords:
                    if keyword.lower() in str(medical_keyword).lower():
                        score += 1
                        matches.append(keyword)
            
            if score > 0:
                specialty_scores[specialty] = {
                    "score": score,
                    "matches": matches,
                    "relevance": score / len(keywords) if keywords else 0
                }
        
        # Sort specialties by score
        sorted_specialties = sorted(specialty_scores.items(), 
                                  key=lambda x: x[1]["score"], reverse=True)
        
        # If no specialties matched but this is a hematology case, add hematology as default
        if not sorted_specialties and any(term in " ".join(all_keywords).lower() 
                                        for term in ["blood", "hematology", "cbc", "complete blood count", "mchc", "lymphocyte", "monocyte"]):
            sorted_specialties = [("Hematology", {"score": 1, "matches": ["blood"], "relevance": 1.0})]
        
        analysis["recommended_specialties"] = dict(sorted_specialties[:5])
        analysis["confidence_scores"] = {k: v["relevance"] for k, v in sorted_specialties[:5]}
        
        # Determine urgency
        high_urgency_terms = ["acute", "severe", "critical", "emergency", "high", "urgent", "life-threatening"]
        low_urgency_terms = ["chronic", "mild", "stable", "normal", "within range"]
        
        # Special handling for hematology cases
        if any(term in " ".join(all_keywords).lower() for term in ["blood", "hematology", "cbc", "complete blood count"]):
            # Check for concerning blood values
            concerning_terms = ["very low", "severely low", "critical", "dangerous", "abnormal", "elevated", "high"]
            if any(term in " ".join(all_keywords).lower() for term in concerning_terms):
                analysis["urgency_level"] = "High"
            elif any(term in " ".join(all_keywords).lower() for term in ["slightly", "mildly", "borderline"]):
                analysis["urgency_level"] = "Medium"
            else:
                analysis["urgency_level"] = "Medium"  # Default for blood tests
        elif any(term in " ".join(all_keywords).lower() for term in high_urgency_terms):
            analysis["urgency_level"] = "High"
        elif any(term in " ".join(all_keywords).lower() for term in low_urgency_terms):
            analysis["urgency_level"] = "Low"
        else:
            analysis["urgency_level"] = "Medium"  # Default urgency level
        
        return analysis

    def score_doctors(self, doctors_df: pd.DataFrame, analysis: Dict) -> pd.DataFrame:
        """Score doctors based on medical analysis"""
        doctors_df = doctors_df.copy()
        
        # Initialize scores
        doctors_df["specialty_match_score"] = 0.0
        doctors_df["experience_score"] = 0.0
        doctors_df["total_score"] = 0.0
        
        # Calculate specialty match scores
        recommended_specialties = analysis["recommended_specialties"]
        max_specialty_score = max([spec["score"] for spec in recommended_specialties.values()]) if recommended_specialties else 1
        
        # Check if this is a hematology/blood-related case
        medical_info = analysis.get("extracted_info", {})
        is_hematology_case = any(term in " ".join(medical_info.get("keywords", [])).lower() 
                               for term in ["blood", "hematology", "cbc", "complete blood count", "mchc", "lymphocyte", "monocyte", "hemoglobin", "platelet", "rbc", "wbc"])
        
        # Additional check for hematology context
        if not is_hematology_case:
            # Check if the analysis itself indicates hematology
            analysis_keywords = " ".join(medical_info.get("keywords", [])).lower()
            is_hematology_case = any(term in analysis_keywords for term in ["blood", "hematology", "cbc", "complete blood count", "mchc", "lymphocyte", "monocyte"])
        
        for idx, doctor in doctors_df.iterrows():
            specialty = doctor["Specialty"]
            
            # Specialty match score
            if specialty in recommended_specialties:
                specialty_score = recommended_specialties[specialty]["score"] / max_specialty_score
                doctors_df.at[idx, "specialty_match_score"] = specialty_score
                
                # Boost hematology specialists for blood-related cases
                if is_hematology_case and specialty == "Hematology":
                    specialty_score = min(1.0, specialty_score * 1.5)  # 50% boost
                    doctors_df.at[idx, "specialty_match_score"] = specialty_score
                
                # Boost internal medicine for general blood cases
                if is_hematology_case and specialty == "Internal Medicine":
                    specialty_score = min(1.0, specialty_score * 1.3)  # 30% boost
                    doctors_df.at[idx, "specialty_match_score"] = specialty_score
            
            # Experience score (diminishing returns after 15 years)
            years = float(doctor["Years_in_Practice"]) if pd.notna(doctor["Years_in_Practice"]) else 0
            exp_score = min(1.0, years / 15.0)
            doctors_df.at[idx, "experience_score"] = exp_score
            
            # Total score (weighted combination)
            total = (specialty_score * 0.8 + exp_score * 0.2) if specialty in recommended_specialties else (exp_score * 0.3)
            doctors_df.at[idx, "total_score"] = total
        
        return doctors_df.sort_values("total_score", ascending=False)

    def generate_recommendations(self, medical_report: Any, doctors_csv_content: str, top_n: int = 5) -> Dict:
        """Generate comprehensive doctor recommendations"""
        
        # Extract medical information
        medical_info = self.extract_medical_info(medical_report)
        
        # Analyze condition
        analysis = self.analyze_condition(medical_info)
        
        # Load doctors data
        doctors_df = self._load_doctors_data(doctors_csv_content)
        
        # Score doctors
        scored_doctors = self.score_doctors(doctors_df, analysis)
        
        # Only include doctors with actual specialty matches (score > 0)
        matching_doctors = scored_doctors[scored_doctors["specialty_match_score"] > 0]
        
        if matching_doctors.empty:
            # No matching doctors found
            return {
                "medical_analysis": {
                    "extracted_info": medical_info,
                    "condition_analysis": analysis,
                    "urgency_level": analysis["urgency_level"]
                },
                "doctor_recommendations": [],
                "summary": {
                    "patient_conditions": medical_info.get("conditions", []),
                    "key_concerns": medical_info.get("abnormal_parameters", []),
                    "top_specialties_needed": list(analysis["recommended_specialties"].keys())[:3],
                    "urgency": analysis["urgency_level"],
                    "total_doctors_recommended": 0,
                    "next_steps": [
                        "No specialists found for your specific condition",
                        "Consider consulting with a general physician first",
                        "Your condition may require specialized care not available in our database",
                        "Keep all medical reports for future specialist consultation"
                    ]
                },
                "no_doctors_found": True,
                "message": "No doctors found matching your medical requirements"
            }
        
        # Generate recommendations from matching doctors only
        top_doctors = matching_doctors.head(min(top_n, len(matching_doctors)))
        
        recommendations = []
        for _, doctor in top_doctors.iterrows():
            specialty = doctor["Specialty"]
            recommendation = {
                "name": doctor["Name"],
                "specialty": specialty,
                "years_experience": int(float(doctor["Years_in_Practice"])),
                "hospital": doctor["Hospital_Affiliation"],
                "address": doctor["Address"],
                "contact": {
                    "mobile": doctor["Mobile"],
                    "email": doctor["Email"]
                },
                "scores": {
                    "specialty_match": round(doctor["specialty_match_score"], 3),
                    "experience": round(doctor["experience_score"], 3),
                    "total": round(doctor["total_score"], 3)
                },
                "why_recommended": self._generate_recommendation_reason(
                    specialty, medical_info, analysis
                ),
                "matched_keywords": analysis["recommended_specialties"].get(specialty, {}).get("matches", [])
            }
            recommendations.append(recommendation)
        
        return {
            "medical_analysis": {
                "extracted_info": medical_info,
                "condition_analysis": analysis,
                "urgency_level": analysis["urgency_level"]
            },
            "doctor_recommendations": recommendations,
            "summary": self._generate_summary(medical_info, analysis, recommendations),
            "no_doctors_found": False,
            "message": f"Found {len(recommendations)} matching doctor(s) for your condition"
        }

    def _load_doctors_data(self, csv_content: str) -> pd.DataFrame:
        """Load and clean doctors data"""
        lines = csv_content.strip().split('\n')
        headers = lines[0].split('\t')
        
        data = []
        for line in lines[1:]:
            if line.strip():
                row = line.split('\t')
                # Ensure row has same number of columns as headers
                while len(row) < len(headers):
                    row.append('')
                data.append(row[:len(headers)])
        
        df = pd.DataFrame(data, columns=headers)
        df['Years_in_Practice'] = pd.to_numeric(df['Years_in_Practice'], errors='coerce')
        return df.dropna(subset=['Years_in_Practice'])

    def _generate_recommendation_reason(self, specialty: str, medical_info: Dict, analysis: Dict) -> str:
        """Generate personalized recommendation reason"""
        reasons = []
        
        # Get matched keywords for this specialty
        matches = analysis["recommended_specialties"].get(specialty, {}).get("matches", [])
        
        if matches:
            reasons.append(f"Specialist expertise matches your condition indicators: {', '.join(matches[:3])}")
        
        # Add condition-specific reasons
        conditions = medical_info.get("conditions", [])
        if conditions:
            reasons.append(f"Recommended for treating: {', '.join(conditions[:2])}")
        
        # Add urgency-based reason
        urgency = analysis.get("urgency_level", "Medium")
        if urgency == "High":
            reasons.append("High priority consultation recommended due to condition severity")
        
        return ". ".join(reasons) if reasons else f"Medical specialist in {specialty} recommended based on your health profile"

    def _generate_summary(self, medical_info: Dict, analysis: Dict, recommendations: List[Dict]) -> Dict:
        """Generate comprehensive summary"""
        return {
            "patient_conditions": medical_info.get("conditions", []),
            "key_concerns": medical_info.get("abnormal_parameters", []),
            "top_specialties_needed": list(analysis["recommended_specialties"].keys())[:3],
            "urgency": analysis["urgency_level"],
            "total_doctors_recommended": len(recommendations),
            "next_steps": [
                f"Schedule consultation with {recommendations[0]['specialty']} specialist" if recommendations else "Consult with general physician",
                "Monitor symptoms and follow medical advice",
                "Keep all medical reports for specialist consultation",
                f"Seek immediate care if symptoms worsen" if analysis["urgency_level"] == "High" else "Follow up as recommended"
            ]
        }

# Core functionality only - no test cases

# FastAPI Models
class ChatbotRequest(BaseModel):
    gemini_response: str
    user_prompt: str

class DoctorRecommendationResponse(BaseModel):
    success: bool
    medical_analysis: Dict
    doctor_recommendations: List[Dict]
    summary: Dict
    message: str
    no_doctors_found: bool

# Initialize FastAPI app
app = FastAPI(title="Medical Doctor Recommendation API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global analyzer instance
analyzer = UniversalMedicalAnalyzer()

@app.get("/")
async def root():
    return {"message": "Medical Doctor Recommendation API is running"}

@app.post("/analyze-gemini-response", response_model=DoctorRecommendationResponse)
async def analyze_gemini_response(request: ChatbotRequest):
    """
    Analyze Gemini AI response and provide doctor recommendations
    """
    try:
        print(f"Received request - Gemini response length: {len(request.gemini_response)}, User prompt: {request.user_prompt}")
        
        # Load doctors CSV data
        try:
            with open("doctors.csv", "r", encoding="utf-8") as f:
                doctors_csv_content = f.read()
            print(f"Loaded doctors CSV with {len(doctors_csv_content.split(chr(10)))} lines")
        except Exception as csv_error:
            print(f"Error loading CSV: {csv_error}")
            raise HTTPException(status_code=500, detail=f"Failed to load doctors database: {str(csv_error)}")
        
        # Create a medical report from Gemini response
        medical_report = {
            "gemini_analysis": request.gemini_response,
            "user_query": request.user_prompt,
            "extracted_conditions": [],
            "extracted_symptoms": [],
            "extracted_keywords": []
        }
        
        # Extract medical information from Gemini response
        try:
            medical_info = analyzer.extract_medical_info(request.gemini_response)
            print(f"Extracted medical info - Keywords: {medical_info.get('keywords', [])}, Conditions: {medical_info.get('conditions', [])}")
        except Exception as extract_error:
            print(f"Error extracting medical info: {extract_error}")
            raise HTTPException(status_code=500, detail=f"Failed to extract medical information: {str(extract_error)}")
        
        # Update medical report with extracted info
        medical_report.update({
            "extracted_conditions": medical_info.get("conditions", []),
            "extracted_symptoms": medical_info.get("symptoms", []),
            "extracted_keywords": medical_info.get("keywords", [])
        })
        
        # Generate doctor recommendations
        try:
            result = analyzer.generate_recommendations(medical_report, doctors_csv_content, top_n=5)
            print(f"Generated recommendations - Found {len(result.get('doctor_recommendations', []))} doctors")
        except Exception as rec_error:
            print(f"Error generating recommendations: {rec_error}")
            raise HTTPException(status_code=500, detail=f"Failed to generate doctor recommendations: {str(rec_error)}")
        
        return DoctorRecommendationResponse(
            success=True,
            medical_analysis=result["medical_analysis"],
            doctor_recommendations=result["doctor_recommendations"],
            summary=result["summary"],
            message=result.get("message", "Successfully analyzed Gemini response and generated doctor recommendations"),
            no_doctors_found=result.get("no_doctors_found", False)
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Unexpected error processing request: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.get("/test-basic")
async def test_basic():
    """
    Test basic functionality without external dependencies
    """
    try:
        # Test the analyzer initialization
        test_analyzer = UniversalMedicalAnalyzer()
        
        # Test basic text extraction
        test_text = "Patient has high blood pressure and chest pain"
        medical_info = test_analyzer.extract_medical_info(test_text)
        
        return {
            "status": "success",
            "analyzer_working": True,
            "extracted_keywords": medical_info.get("keywords", []),
            "extracted_conditions": medical_info.get("conditions", []),
            "message": "Basic functionality test passed"
        }
    except Exception as e:
        return {
            "status": "error",
            "analyzer_working": False,
            "error": str(e),
            "message": "Basic functionality test failed"
        }

if __name__ == "__main__":
    # Run the FastAPI server directly
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)