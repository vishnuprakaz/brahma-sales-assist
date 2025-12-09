import os

from google.adk.agents import Agent, LlmAgent
from google.adk.tools import AgentTool
from google.adk.tools.retrieval.vertex_ai_rag_retrieval import VertexAiRagRetrieval
from vertexai.preview import rag

from dotenv import load_dotenv

load_dotenv()

root_agent = LlmAgent(
    model='gemini-2.0-flash',
    name='orchestrator_agent',
    instruction="Your job is orchestrate the user query based on the available agents",

)

