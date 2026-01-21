from llm_client import LLMClient

llm = LLMClient()

prompt = "Write a short motivational quote for students learning Artificial Intelligence."
result = llm.generate_content(prompt)

print("Generated Output:\n")
print(result)
