from fastapi import APIRouter, HTTPException
from models.schemas import BusinessCreate, BusinessResponse
from db.supabase import get_supabase

router = APIRouter()

@router.post("/", response_model=BusinessResponse)
def create_business(business: BusinessCreate):
    supabase = get_supabase()

    # Check if business already exists with same name and owner
    existing = supabase.table("businesses")\
        .select("*")\
        .eq("name", business.name)\
        .eq("owner_name", business.owner_name)\
        .execute()

    if existing.data:
        return existing.data[0]

    # Create new if not found
    result = supabase.table("businesses").insert({
        "name": business.name,
        "type": business.type,
        "owner_name": business.owner_name
    }).execute()

    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create business")

    return result.data[0]

@router.get("/{business_id}", response_model=BusinessResponse)
def get_business(business_id: str):
    supabase = get_supabase()
    result = supabase.table("businesses")\
        .select("*")\
        .eq("id", business_id)\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Business not found")

    return result.data[0]