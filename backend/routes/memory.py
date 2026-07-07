from services.qwen import ask_memory_agent, generate_business_pulse
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from models.schemas import MemoryCreate, MemoryResponse, QueryRequest, QueryResponse
from services.memory import store_memory, get_business_memory
from services.qwen import ask_memory_agent
from db.supabase import get_supabase
import uuid

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

@router.post("/upload")
async def upload_media(
    business_id: str = Form(...),
    file: UploadFile = File(...)
):
    supabase = get_supabase()

    # Determine input type
    content_type = file.content_type or ""
    if content_type.startswith("image"):
        input_type = "image"
    elif content_type.startswith("audio"):
        input_type = "voice"
    elif content_type.startswith("video"):
        input_type = "video"
    else:
        input_type = "file"

    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
    filename = f"{business_id}/{uuid.uuid4()}.{ext}"

    # Upload to Supabase Storage
    file_bytes = await file.read()
    supabase.storage.from_("biashara-media").upload(
        filename,
        file_bytes,
        {"content-type": content_type}
    )

    # Get public URL
    url = supabase.storage.from_("biashara-media").get_public_url(filename)

    # Store as memory
    content = f"[{input_type.upper()}] File uploaded: {url}"
    result = store_memory(
        business_id=business_id,
        content=content,
        input_type=input_type
    )

    return {
        "message": "File uploaded and saved to memory",
        "url": url,
        "memory": result
    }

@router.post("/whatsapp-forward")
async def whatsapp_forward(payload: dict):
    business_id = payload.get("business_id")
    conversation = payload.get("conversation")

    if not business_id or not conversation:
        raise HTTPException(status_code=400, detail="Missing business_id or conversation")

    content = f"[WhatsApp Forward] {conversation}"
    result = store_memory(
        business_id=business_id,
        content=content,
        input_type="text"
    )

    return {
        "message": "WhatsApp conversation processed and saved to memory",
        "memory": result
    }

@router.post("/ask", response_model=QueryResponse)
def ask_question(query: QueryRequest):
    context = get_business_memory(query.business_id)
    answer = ask_memory_agent(context, query.question)
    return QueryResponse(answer=answer)

@router.get("/{business_id}/pulse")
def get_business_pulse(business_id: str):
    context = get_business_memory(business_id)
    pulse = generate_business_pulse(context)
    return {"business_id": business_id, "pulse": pulse}

@router.get("/{business_id}")
def get_memories(business_id: str):
    context = get_business_memory(business_id)
    return {"business_id": business_id, "memory": context}