import os
# pyrefly: ignore [missing-import]
from langchain_groq import ChatGroq
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field

def get_llm(model_name="llama-3.3-70b-versatile"):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("Warning: GROQ_API_KEY is not set. Agents will fail when called.")
    return ChatGroq(
        model=model_name,
        api_key=api_key or "DUMMY_KEY_FOR_INIT"
    )

class RequirementOutput(BaseModel):
    entities: list[str] = Field(description="List of domain entities mentioned")
    apis: list[str] = Field(description="List of necessary APIs or endpoints")
    validations: list[str] = Field(description="List of business validations")
    database_tables: list[str] = Field(description="List of required database tables")

class EngineeringAnalysisOutput(BaseModel):
    complexity_score: int = Field(description="Complexity score from 0 to 100")
    risk_assessment: str = Field(description="High/Medium/Low with brief reason")
    impacted_modules: list[str] = Field(description="List of impacted modules")
    dependencies: list[str] = Field(description="List of external or internal dependencies")
    story_point_estimate: int = Field(description="Fibonacci story point estimate")
    architecture_recommendation: str = Field(description="Detailed architectural recommendation")

class TestCaseOutput(BaseModel):
    positive: list[str] = Field(description="Positive test cases")
    negative: list[str] = Field(description="Negative test cases")
    boundary: list[str] = Field(description="Boundary test cases")
    security: list[str] = Field(description="Security test cases")
    performance: list[str] = Field(description="Performance test cases")

class CodeFile(BaseModel):
    name: str = Field(description="File name with extension, e.g., main.py")
    content: str = Field(description="The raw code content of the file. Do NOT use markdown code blocks.")

class CodeOutput(BaseModel):
    files: list[CodeFile] = Field(description="List of code files generated")

class ReviewOutput(BaseModel):
    score: int = Field(description="Review score from 0 to 100 based on code quality and requirement satisfaction")
    critical_issues: list[str] = Field(description="List of critical bugs or blockers")
    medium_issues: list[str] = Field(description="List of medium severity issues")
    low_priority_suggestions: list[str] = Field(description="List of minor suggestions or nitpicks")
    security_findings: list[str] = Field(description="List of security vulnerabilities or concerns")
    performance_findings: list[str] = Field(description="List of performance bottlenecks or improvements")
    recommended_fixes: list[str] = Field(description="List of actionable recommended fixes")

def extract_requirements(ticket_summary: str, ticket_description: str) -> dict:
    llm = get_llm().with_structured_output(RequirementOutput)
    prompt = """
    Analyze the following Jira ticket and extract software requirements.
    
    Summary: {ticket_summary}
    Description: {ticket_description}
    """.format(ticket_summary=ticket_summary, ticket_description=ticket_description)
    try:
        res = llm.invoke(prompt)
        return res.model_dump()
    except Exception as e:
        print(f"LLM Error (Requirements): {e}")
        return {"entities": [], "apis": [], "validations": [], "database_tables": []}

def generate_engineering_analysis(ticket_summary: str, ticket_description: str) -> dict:
    llm = get_llm().with_structured_output(EngineeringAnalysisOutput)
    prompt = """
    Analyze the following Jira ticket and provide a comprehensive engineering analysis.
    Include a complexity score (0-100), risk assessment, impacted modules, dependencies, story point estimate, and architectural recommendations.
    
    Summary: {ticket_summary}
    Description: {ticket_description}
    """.format(ticket_summary=ticket_summary, ticket_description=ticket_description)
    try:
        res = llm.invoke(prompt)
        return res.model_dump()
    except Exception as e:
        print(f"LLM Error (Analysis): {e}")
        return {
            "complexity_score": 0,
            "risk_assessment": "Unknown",
            "impacted_modules": [],
            "dependencies": [],
            "story_point_estimate": 0,
            "architecture_recommendation": "Failed to analyze."
        }

def generate_test_cases(ticket_summary: str, ticket_description: str) -> dict:
    llm = get_llm().with_structured_output(TestCaseOutput)
    prompt = """
    Generate comprehensive QA test cases for the following Jira ticket.
    
    Summary: {ticket_summary}
    Description: {ticket_description}
    """.format(ticket_summary=ticket_summary, ticket_description=ticket_description)
    try:
        res = llm.invoke(prompt)
        return res.model_dump()
    except Exception as e:
        print(f"LLM Error (TestCases): {e}")
        return {"positive": [], "negative": [], "boundary": [], "security": [], "performance": []}

import re

def generate_code_stub(ticket_summary: str, ticket_description: str, requirements: dict, stack: str) -> dict:
    llm = get_llm()
    prompt = """
    You are an expert developer. Generate the complete source code for the feature described below using the {stack} stack.
    Your implementation must be thorough, realistic, and production-ready.
    
    You MUST output each file wrapped in XML tags like this:
    <file name="path/to/filename.ext">
    // code here
    </file>
    
    Feature Summary: {ticket_summary}
    Feature Description: {ticket_description}
    Extracted Requirements: {requirements}
    """.format(ticket_summary=ticket_summary, ticket_description=ticket_description, requirements=requirements, stack=stack)
    try:
        res = llm.invoke(prompt)
        text = res.content
        
        files = []
        # Find all <file name="...">...</file>
        pattern = r'<file\s+name="([^"]+)">\s*(.*?)\s*</file>'
        matches = re.findall(pattern, text, re.DOTALL)
        
        for name, content in matches:
            files.append({
                "name": name,
                "content": content.strip()
            })
            
        if not files:
            # Fallback if the LLM used markdown blocks instead
            md_pattern = r'```[\w]*\s*(?:#|//)?\s*([a-zA-Z0-9_\-\.]+)?\n(.*?)```'
            md_matches = re.findall(md_pattern, text, re.DOTALL)
            for idx, (name, content) in enumerate(md_matches):
                files.append({
                    "name": name.strip() or f"file_{idx}.txt",
                    "content": content.strip()
                })
                
        return {"files": files}
    except Exception as e:
        print(f"LLM Error (Code XML): {e}")
        return {"files": []}

def generate_code_review(ticket_summary: str, ticket_description: str, generated_code: dict) -> dict:
    files = generated_code.get("files", [])
    if not files:
        return {
            "score": 0, 
            "critical_issues": ["CRITICAL: No code files were generated."],
            "medium_issues": [],
            "low_priority_suggestions": [],
            "security_findings": [],
            "performance_findings": [],
            "recommended_fixes": []
        }
        
    llm = get_llm().with_structured_output(ReviewOutput)
    
    files_str = "\n".join([f"--- {f['name']} ---\n{f['content']}\n" for f in files])
    
    prompt = """
    You are an expert Senior Code Reviewer. Review the following generated code against the feature requirements.
    Provide a realistic score (0-100) and specific feedback categorized by critical, medium, low severity, security, performance, and recommended fixes.
    If the code is incomplete or poorly structured, give it a low score.
    
    Feature Summary: {ticket_summary}
    Feature Description: {ticket_description}
    
    Generated Code:
    {files_str}
    """.format(ticket_summary=ticket_summary, ticket_description=ticket_description, files_str=files_str)
    try:
        res = llm.invoke(prompt)
        return res.model_dump()
    except Exception as e:
        print(f"LLM Error (Review): {e}")
        return {
            "score": 0,
            "critical_issues": ["Failed to generate review due to LLM error."],
            "medium_issues": [],
            "low_priority_suggestions": [],
            "security_findings": [],
            "performance_findings": [],
            "recommended_fixes": []
        }
