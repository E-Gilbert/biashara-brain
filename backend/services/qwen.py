import os
from openai import OpenAI

def get_qwen_client() -> OpenAI:
    return OpenAI(
        api_key=os.getenv("QWEN_API_KEY"),
        base_url=os.getenv("QWEN_BASE_URL")
    )

def ask_memory_agent(context: str, question: str) -> str:
    client = get_qwen_client()

    system_prompt = """You are Biashara Brain, an AI business memory agent for African SMEs.
You have been given the full memory of a business — customer interactions, supplier deals, 
agreements, transactions, and notes. Answer the owner's questions accurately and concisely 
based only on the memory provided. If the information is not in the memory, say so honestly.
Respond in the same language the owner uses — English, Swahili, or mixed."""

    response = client.chat.completions.create(
        model="qwen-plus",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Business memory:\n{context}\n\nQuestion: {question}"}
        ]
    )

    return response.choices[0].message.content