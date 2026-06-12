from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BusinessCreate(BaseModel):
    name: str
    type: str
    owner_name: str

class BusinessResponse(BaseModel):
    id: str
    name: str
    type: str
    owner_name: str
    created_at: datetime

class MemoryCreate(BaseModel):
    business_id: str
    content: str
    input_type: str  # text, voice, image

class MemoryResponse(BaseModel):
    id: str
    business_id: str
    content: str
    input_type: str
    created_at: datetime

class QueryRequest(BaseModel):
    business_id: str
    question: str

class QueryResponse(BaseModel):
    answer: str
    sources: Optional[list] = []