# tools/send_email_tool.py
import os
from utils.sendgrid_emailer import SendGridEmailer
from langchain.tools import tool
from typing import List
from dotenv import load_dotenv


class SendEmailTool:
    def __init__(self):
        load_dotenv()
        self.api_key = os.environ.get("SENDGRID_API_KEY")
        self.from_email = os.environ.get(
            "SENDGRID_FROM_EMAIL", "jyotiprakash4357@gmail.com"
        )

        if not self.api_key:
            raise ValueError("SENDGRID_API_KEY environment variable is required")

        self.email_service = SendGridEmailer(self.api_key, self.from_email)
        self.send_email_tool_list = self._setup_tools()

    def _setup_tools(self) -> List:
        @tool
        def send_email(
            to: List[str], subject: str, body: str, file_path: str = None
        ) -> str:
            """
            Send an email to the given list of recipients.

            Args:
                to: List of email addresses
                subject: Subject line for the email
                body: Plain text message content
                file_path: Optional full path to a local file (e.g., Markdown or PDF)

            Returns:
                String indicating success or failure of email sending
            """
            try:
                return self.email_service.send_email(to, subject, body, file_path)
            except Exception as e:
                return f"Failed to send email: {str(e)}"

        return [send_email]

    def get_send_email_tool(self):
        """Helper method to get the send email tool directly"""
        return self.send_email_tool_list[0]
