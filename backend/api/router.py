# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, BackgroundTasks
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from services.jira_service import jira_service
from agents.workflow import graph, AgentState
import uuid
from datetime import datetime

api_router = APIRouter()

job_store = {}

class TicketRequest(BaseModel):
    ticket_id: str

class GenerateRequest(BaseModel):
    ticket_id: str
    workflow_mode: str # "QA" or "DEV"

@api_router.post("/ticket/analyze")
async def analyze_ticket(request: TicketRequest):
    try:
        ticket_data = jira_service.get_ticket_details(request.ticket_id)
        return {"status": "success", "data": ticket_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def run_workflow_task(job_id: str, initial_state: AgentState):
    try:
        job_store[job_id]["status"] = "processing"
        final_state = dict(initial_state)
        
        # Stream intermediate steps to update timeline
        for event in graph.stream(initial_state):
            node_name = list(event.keys())[0]
            node_state = event[node_name]
            
            job_store[job_id]["timeline"].append({
                "node": node_name,
                "timestamp": datetime.now().isoformat(),
                "status": "completed"
            })
            
            # Update the latest state incrementally
            for k, v in node_state.items():
                final_state[k] = v
                
            job_store[job_id]["result"] = final_state
            
        job_store[job_id]["status"] = "completed"
    except Exception as e:
        print(f"Workflow error: {e}")
        job_store[job_id]["status"] = "failed"
        job_store[job_id]["error"] = str(e)

@api_router.post("/jobs/generate")
async def generate_from_ticket(request: GenerateRequest, background_tasks: BackgroundTasks):
    try:
        ticket_data = jira_service.get_ticket_details(request.ticket_id)
        
        initial_state: AgentState = {
            "ticket_id": request.ticket_id,
            "ticket_data": ticket_data,
            "workflow_mode": request.workflow_mode,
            "requirements": None,
            "engineering_analysis": None,
            "test_cases": None,
            "generated_code": None,
            "review_report": None
        }
        
        job_id = str(uuid.uuid4())
        job_store[job_id] = {
            "job_id": job_id,
            "status": "queued",
            "timeline": [],
            "result": None,
            "error": None
        }
        
        background_tasks.add_task(run_workflow_task, job_id, initial_state)
        return {"status": "success", "job_id": job_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/jobs/{job_id}/status")
async def get_job_status(job_id: str):
    if job_id not in job_store:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Return everything except the potentially large result to keep polling light
    job_data = job_store[job_id]
    return {
        "job_id": job_id,
        "status": job_data["status"],
        "timeline": job_data["timeline"],
        "error": job_data["error"]
    }

@api_router.get("/jobs/{job_id}/result")
async def get_job_result(job_id: str):
    if job_id not in job_store:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"status": "success", "data": job_store[job_id]["result"]}
