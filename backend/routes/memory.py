from fastapi import APIRouter, HTTPException
from models.schemas import MemoryCreate, MemoryResponse, QueryRequest, QueryResponse
from services.memory import store_memory, get_business_memory
from services.qwen import ask_memory_agent

router = APIRouter()

@router.post("/add", response_model=MemoryResponse)
def add_memory(memory: MemoryCreate):
    result = store_memory(
        business_id=memory.business_id,
        content=memory.content,
        input_type=memory.input_type
    )

    if not result:
        raise HTTPException(status_code=400, detail="Failed to store memory")

    return result

@router.post("/ask", response_model=QueryResponse)
def ask_question(query: QueryRequest):
    context = get_business_memory(query.business_id)
    answer = ask_memory_agent(context, query.question)
    return QueryResponse(answer=answer)

@router.get("/{business_id}")
def get_memories(business_id: str):
    context = get_business_memory(business_id)
    return {"business_id": business_id, "memory": context}