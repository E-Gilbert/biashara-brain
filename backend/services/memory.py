from db.supabase import get_supabase

def store_memory(business_id: str, content: str, input_type: str) -> dict:
    supabase = get_supabase()
    result = supabase.table("memories").insert({
        "business_id": business_id,
        "content": content,
        "input_type": input_type
    }).execute()
    return result.data[0] if result.data else {}

def get_business_memory(business_id: str) -> str:
    supabase = get_supabase()
    result = supabase.table("memories")\
        .select("*")\
        .eq("business_id", business_id)\
        .order("created_at")\
        .execute()

    if not result.data:
        return "No memory stored yet."

    memory_text = ""
    for entry in result.data:
        memory_text += f"[{entry['created_at']}] ({entry['input_type']}): {entry['content']}\n"

    return memory_text