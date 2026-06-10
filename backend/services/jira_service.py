import os
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

JIRA_URL = os.getenv("JIRA_URL")
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")

class JiraService:
    def __init__(self):
        if not all([JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN]):
            raise ValueError("Jira credentials are not fully configured in environment variables.")
        self.auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)
        self.headers = {"Accept": "application/json"}

    def get_ticket_details(self, ticket_id: str) -> dict:
        """
        Fetches ticket details from Jira REST API.
        """
        # The endpoint for getting an issue
        url = f"{JIRA_URL}/rest/api/3/issue/{ticket_id}"
        
        response = requests.get(url, headers=self.headers, auth=self.auth)
        
        if response.status_code == 404:
            raise ValueError(f"Ticket {ticket_id} not found.")
        elif response.status_code != 200:
            raise Exception(f"Failed to fetch ticket from Jira: {response.text}")
            
        data = response.json()
        fields = data.get("fields", {})
        
        # Extract necessary information
        summary = fields.get("summary", "")
        # Jira API v3 uses Atlassian Document Format for descriptions. We might need to parse it.
        # For simplicity in this mock, we'll try to extract raw text or return the struct.
        description = fields.get("description", "No description provided.")
        
        # Parse assignee
        assignee_data = fields.get("assignee")
        assignee = assignee_data.get("displayName") if assignee_data else "Unassigned"
        
        # Parse priority
        priority_data = fields.get("priority")
        priority = priority_data.get("name") if priority_data else "None"
        
        return {
            "id": ticket_id,
            "summary": summary,
            "description": description,
            "assignee": assignee,
            "priority": priority,
            "status": fields.get("status", {}).get("name", "Unknown"),
            "raw_data": data # Keep raw data just in case
        }

jira_service = JiraService()
