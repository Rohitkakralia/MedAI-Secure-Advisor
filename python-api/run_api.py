import uvicorn

if __name__ == "__main__":
    print("Starting Medical Doctor Recommendation API...")
    print("API will be available at: http://localhost:8000")
    print("Health check: http://localhost:8000/health")
    print("API docs: http://localhost:8000/docs")
    
    uvicorn.run(
        "main:app",  # Import as string to enable reload
        host="0.0.0.0", 
        port=8000,
        reload=True  # Enable auto-reload during development
    )
