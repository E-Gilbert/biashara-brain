from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import memory, business
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Biashara Brain API",
    description="AI-powered business memory agent for African SMEs",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(business.router, prefix="/business", tags=["business"])
app.include_router(memory.router, prefix="/memory", tags=["memory"])

@app.get("/")
def root():
    return {"message": "Biashara Brain is running"}