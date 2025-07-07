# utils/sendgrid_emailer.py
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail,
    Attachment,
    FileContent,
    FileName,
    FileType,
    Disposition,
)
import os
import base64
import mimetypes
from typing import List


class SendGridEmailer:
    def __init__(self, api_key: str, from_email: str):
        if not api_key:
            raise ValueError("SendGrid API key is required")
        if not from_email:
            raise ValueError("From email address is required")

        self.sg = SendGridAPIClient(api_key)
        self.from_email = from_email

    def send_email(
        self, to: List[str], subject: str, body: str, file_path: str = None
    ) -> str:
        """
        Send an email with optional file attachment.

        Args:
            to: List of recipient email addresses
            subject: Email subject line
            body: Email body content (plain text)
            file_path: Optional path to file attachment

        Returns:
            Success or error message string
        """
        try:
            # Validate inputs
            if not to or not isinstance(to, list):
                raise ValueError("'to' must be a non-empty list of email addresses")
            if not subject:
                raise ValueError("Subject cannot be empty")
            if not body:
                raise ValueError("Body cannot be empty")

            # Create the email message
            message = Mail(
                from_email=self.from_email,
                to_emails=to,
                subject=subject,
                plain_text_content=body,
            )

            # Add attachment if file path is provided
            if file_path:
                if not os.path.exists(file_path):
                    raise FileNotFoundError(f"File not found: {file_path}")

                self._add_attachment(message, file_path)

            # Send the email
            response = self.sg.send(message)

            # Check if the email was sent successfully
            if response.status_code in [200, 201, 202]:
                return f"✅ Email sent successfully to {', '.join(to)} (Status: {response.status_code})"
            else:
                return (
                    f"❌ Email sending failed with status code: {response.status_code}"
                )

        except Exception as e:
            return f"❌ Failed to send email: {str(e)}"

    def _add_attachment(self, message: Mail, file_path: str):
        """Add file attachment to the email message."""
        try:
            # Read and encode the file
            with open(file_path, "rb") as f:
                data = f.read()
                encoded = base64.b64encode(data).decode()

            # Determine file type
            mime_type, _ = mimetypes.guess_type(file_path)
            if not mime_type:
                # Default to text/plain for unknown types
                mime_type = "text/plain"
                if file_path.endswith(".md"):
                    mime_type = "text/markdown"
                elif file_path.endswith(".pdf"):
                    mime_type = "application/pdf"

            # Create attachment
            attachment = Attachment()
            attachment.file_content = FileContent(encoded)
            attachment.file_type = FileType(mime_type)
            attachment.file_name = FileName(os.path.basename(file_path))
            attachment.disposition = Disposition("attachment")

            message.attachment = attachment

        except Exception as e:
            raise Exception(f"Failed to add attachment: {str(e)}")

    def validate_email_addresses(self, emails: List[str]) -> bool:
        """Simple email validation."""
        import re

        email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

        for email in emails:
            if not re.match(email_pattern, email.strip()):
                raise ValueError(f"Invalid email address: {email}")
        return True
