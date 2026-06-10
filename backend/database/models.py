from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class JiraTicket(Base):
    __tablename__ = "jira_tickets"

    id = Column(String, primary_key=True, index=True) # e.g. PROJ-123
    summary = Column(String)
    description = Column(Text)
    status = Column(String)
    priority = Column(String)
    assignee = Column(String)
    raw_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneratedTestCase(Base):
    __tablename__ = "generated_testcases"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, ForeignKey("jira_tickets.id"))
    content = Column(JSON) # Structured test cases (positive, negative, etc.)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneratedCode(Base):
    __tablename__ = "generated_code"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, ForeignKey("jira_tickets.id"))
    stack = Column(String) # e.g. React + FastAPI
    files = Column(JSON) # List of generated files and contents
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ReviewReport(Base):
    __tablename__ = "review_reports"

    id = Column(Integer, primary_key=True, index=True)
    code_id = Column(Integer, ForeignKey("generated_code.id"))
    overall_score = Column(Integer)
    quality_score = Column(Integer)
    security_score = Column(Integer)
    performance_score = Column(Integer)
    maintainability_score = Column(Integer)
    findings = Column(JSON) # List of issues
    recommendations = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
