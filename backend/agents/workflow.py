from typing import TypedDict, Optional
from langgraph.graph import StateGraph, START, END
from agents.llm_utils import extract_requirements, generate_engineering_analysis, generate_test_cases, generate_code_stub, generate_code_review

class AgentState(TypedDict):
    ticket_id: str
    ticket_data: Optional[dict]
    requirements: Optional[dict]
    engineering_analysis: Optional[dict]
    workflow_mode: Optional[str]  # "QA" or "DEV"
    test_cases: Optional[dict]
    generated_code: Optional[dict]
    review_report: Optional[dict]

def jira_node(state: AgentState):
    return {"ticket_data": state.get("ticket_data")}

def requirement_node(state: AgentState):
    ticket = state.get("ticket_data", {})
    summary = ticket.get("summary", "")
    description = ticket.get("description", "")
    reqs = extract_requirements(summary, description)
    return {"requirements": reqs}

def analysis_node(state: AgentState):
    ticket = state.get("ticket_data", {})
    summary = ticket.get("summary", "")
    description = ticket.get("description", "")
    analysis = generate_engineering_analysis(summary, description)
    return {"engineering_analysis": analysis}

def testcase_node(state: AgentState):
    ticket = state.get("ticket_data", {})
    summary = ticket.get("summary", "")
    description = ticket.get("description", "")
    cases = generate_test_cases(summary, description)
    return {"test_cases": cases}

def codegen_node(state: AgentState):
    ticket = state.get("ticket_data", {})
    summary = ticket.get("summary", "")
    description = ticket.get("description", "")
    reqs = state.get("requirements", {})
    # Hardcoded stack for MVP
    code = generate_code_stub(summary, description, reqs, "FastAPI")
    return {"generated_code": code}

def review_node(state: AgentState):
    ticket = state.get("ticket_data", {})
    summary = ticket.get("summary", "")
    description = ticket.get("description", "")
    code = state.get("generated_code", {})
    
    review = generate_code_review(summary, description, code)
    return {"review_report": review}

def report_node(state: AgentState):
    return state

def route_workflow(state: AgentState):
    if state.get("workflow_mode") == "QA":
        return "testcase_node"
    return "codegen_node"

def build_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("jira_node", jira_node)
    workflow.add_node("requirement_node", requirement_node)
    workflow.add_node("analysis_node", analysis_node)
    workflow.add_node("testcase_node", testcase_node)
    workflow.add_node("codegen_node", codegen_node)
    workflow.add_node("review_node", review_node)
    workflow.add_node("report_node", report_node)
    
    workflow.add_edge(START, "jira_node")
    workflow.add_edge("jira_node", "requirement_node")
    workflow.add_edge("requirement_node", "analysis_node")
    
    workflow.add_conditional_edges(
        "analysis_node",
        route_workflow,
        {
            "testcase_node": "testcase_node",
            "codegen_node": "codegen_node"
        }
    )
    
    workflow.add_edge("testcase_node", "report_node")
    workflow.add_edge("codegen_node", "review_node")
    workflow.add_edge("review_node", "report_node")
    workflow.add_edge("report_node", END)
    
    return workflow.compile()

graph = build_graph()
