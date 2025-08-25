import requests
import json

def test_api():
    """Test the API endpoints"""
    base_url = "http://localhost:8000"
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
        return
    
    # Test doctor recommendation endpoint
    test_data = {
        "gemini_response": """
        Based on the medical report analysis, the patient shows signs of cardiovascular issues including:
        - Elevated blood pressure readings
        - Chest pain symptoms
        - Abnormal ECG findings
        - High cholesterol levels
        
        The most probable diagnosis is hypertension with potential cardiac involvement.
        """,
        "user_prompt": "What are the symptoms and what doctors should I see?"
    }
    
    try:
        response = requests.post(
            f"{base_url}/analyze-gemini-response",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n✅ API call successful!")
            print(f"Medical Analysis: {result['medical_analysis']['urgency_level']} urgency")
            print(f"Top Doctor: {result['doctor_recommendations'][0]['name']} - {result['doctor_recommendations'][0]['specialty']}")
            print(f"Match Score: {result['doctor_recommendations'][0]['scores']['total']:.1%}")
        else:
            print(f"❌ API call failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ API test failed: {e}")

if __name__ == "__main__":
    print("Testing Medical Doctor Recommendation API...")
    test_api()
