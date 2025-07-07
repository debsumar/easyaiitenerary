import streamlit as st
import requests
import datetime
import os
from dotenv import load_dotenv

from utils.save_to_document import save_document
from tools.send_email_tool import SendEmailTool

load_dotenv()

st.set_page_config(
    page_title="🌍 Travel Planner Agentic Application",
    page_icon="🌍",
    layout="centered",
    initial_sidebar_state="expanded",
)

# ================== Custom CSS Styling ==================
st.markdown(
    """
<style>
    /* Main app styling */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 1000px;
    }
    
    /* Header styling */
    .main-header {
        text-align: center;
        padding: 1rem 0;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        margin-bottom: 2rem;
        color: white;
    }
    
    /* Form styling */
    .stForm {
        background-color: #f8f9fa;
        padding: 1.5rem;
        border-radius: 10px;
        border: 1px solid #e9ecef;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* Button styling */
    .stButton > button {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    /* Tab styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 20px;
        background-color: #f8f9fa;
        border-radius: 10px;
        padding: 0.5rem;
    }
    
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        background-color: transparent;
        border-radius: 8px;
        color: #495057;
        font-weight: 600;
    }
    
    .stTabs [aria-selected="true"] {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white !important;
    }
    
    /* Success/Error message styling */
    .stSuccess {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 8px;
    }
    
    .stError {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 8px;
    }
    
    /* Text area styling */
    .travel-plan-display {
        background-color: #ffffff;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        padding: 1rem;
    }
    
    /* Quick actions card */
    .quick-actions {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
    }
    
    /* Input field styling */
    .stTextInput > div > div > input {
        border-radius: 8px;
        border: 2px solid #e9ecef;
        transition: border-color 0.3s ease;
    }
    
    .stTextInput > div > div > input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    
    /* Download button special styling */
    .download-btn {
        background: linear-gradient(45deg, #28a745, #20c997);
    }
    
    /* Emoji enhancement */
    .emoji {
        font-size: 1.2em;
        margin-right: 0.5rem;
    }
</style>
""",
    unsafe_allow_html=True,
)

# Main header with gradient
st.markdown(
    """
<div class="main-header">
    <h1>🌍 Travel Planner Agentic Application</h1>
    <p style="margin: 0; opacity: 0.9;">Plan your perfect trip with AI assistance</p>
</div>
""",
    unsafe_allow_html=True,
)

BASE_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

# ================== Session State Initialization ==================
if "messages" not in st.session_state:
    st.session_state.messages = []

if "travel_plan" not in st.session_state:
    st.session_state.travel_plan = None

if "travel_plan_filename" not in st.session_state:
    st.session_state.travel_plan_filename = None

if "email_sent" not in st.session_state:
    st.session_state.email_sent = False

if "email_result" not in st.session_state:
    st.session_state.email_result = ""

if "show_email_form" not in st.session_state:
    st.session_state.show_email_form = False

# ================== Query Form ==================
st.markdown(
    """
<div style="text-align: center; margin: 2rem 0;">
    <h3>✨ How can I help you plan your perfect trip?</h3>
    <p style="color: #6c757d; margin-bottom: 1.5rem;">Tell me about your destination, duration, interests, and I'll create a personalized itinerary!</p>
</div>
""",
    unsafe_allow_html=True,
)

with st.form(key="query_form", clear_on_submit=True):
    col1, col2 = st.columns([4, 1])

    with col1:
        user_input = st.text_input(
            "Your Travel Request",
            placeholder="e.g. Plan a 5-day romantic trip to Paris with museums and fine dining",
            help="💡 Be specific about destination, duration, interests, and budget for better results",
            label_visibility="collapsed",
        )

    with col2:
        st.markdown("<br>", unsafe_allow_html=True)  # Add spacing
        submit_button = st.form_submit_button(
            "🚀 Plan My Trip",
            use_container_width=True,
            help="Generate your personalized travel plan",
        )

if submit_button and user_input.strip():
    try:
        with st.spinner("✈️ Planning your trip..."):
            response = requests.post(f"{BASE_URL}/query", json={"question": user_input})

        if response.status_code == 200:
            answer = response.json().get("answer", "No answer returned.")

            # Save as markdown
            filename = save_document(answer)

            # Store in session state
            st.session_state.travel_plan = answer
            st.session_state.travel_plan_filename = filename
            st.session_state.show_email_form = True
            st.session_state.email_sent = False
            st.session_state.email_result = ""

            st.success("✅ Travel plan generated and saved!")
        else:
            st.error(f"❌ Error: {response.status_code}")

    except Exception as e:
        st.error(f"❌ Unexpected error: {e}")

# ================== Display Travel Plan ==================
if st.session_state.travel_plan:
    st.markdown("---")

    # Use tabs for better organization and space efficiency
    tab1, tab2 = st.tabs(["📋 View Plan", "📧 Send Email"])

    with tab1:
        # Plan summary first
        st.markdown(
            """
        <div class="quick-actions">
            <h4>✅ Your travel plan is ready!</h4>
            <p>Your personalized itinerary has been generated and saved. You can download it or send it via email.</p>
        </div>
        """,
            unsafe_allow_html=True,
        )

        # Quick actions row
        col1, col2, col3 = st.columns([2, 1, 1])
        with col1:
            st.markdown("**🚀 Quick Actions:**")
        with col2:
            if st.session_state.travel_plan_filename and os.path.exists(
                st.session_state.travel_plan_filename
            ):
                with open(st.session_state.travel_plan_filename, "rb") as f:
                    st.download_button(
                        label="⬇️ Download",
                        data=f,
                        file_name=os.path.basename(
                            st.session_state.travel_plan_filename
                        ),
                        mime="text/markdown",
                        use_container_width=True,
                        help="Download your travel plan as a Markdown file",
                    )
        with col3:
            if st.button(
                "🔄 New Plan",
                use_container_width=True,
                help="Start planning a new trip",
            ):
                st.session_state.travel_plan = None
                st.session_state.travel_plan_filename = None
                st.session_state.show_email_form = False
                st.session_state.email_sent = False
                st.session_state.email_result = ""
                st.rerun()

        # Travel plan display with proper styling
        st.markdown("**📋 Your Travel Plan:**")
        st.markdown('<div class="travel-plan-display">', unsafe_allow_html=True)

        # Fix the accessibility warning by providing a proper label
        st.text_area(
            label="Travel Plan Content",
            value=st.session_state.travel_plan,
            height=300,
            disabled=True,
            label_visibility="collapsed",
            help="Your complete travel itinerary - scroll to view all details",
        )

        st.markdown("</div>", unsafe_allow_html=True)

    with tab2:
        # Email form moved to its own tab with better styling
        st.markdown(
            """
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <h3>📧 Send Travel Plan via Email</h3>
            <p style="color: #6c757d;">Share your travel plan with friends, family, or colleagues</p>
        </div>
        """,
            unsafe_allow_html=True,
        )

        # Email form with enhanced styling
        with st.form(key="email_form", clear_on_submit=False):
            st.markdown("**📮 Email Details:**")

            col1, col2 = st.columns([2, 1])
            with col1:
                email_input = st.text_input(
                    "Recipient Email(s)",
                    placeholder="e.g. user1@example.com, user2@example.com",
                    help="💡 Tip: Separate multiple emails with commas",
                )
            with col2:
                st.markdown("<br>", unsafe_allow_html=True)  # Add spacing
                st.info("📝 Multiple emails supported")

            subject = st.text_input(
                "Email Subject",
                value="Your AI Travel Plan",
                help="Customize your email subject line",
            )

            # Send button with better positioning
            col1, col2, col3 = st.columns([2, 1, 1])
            with col3:
                send_button = st.form_submit_button(
                    "📤 Send Email",
                    use_container_width=True,
                    help="Send your travel plan as an email attachment",
                )

            if send_button:
                if not email_input.strip():
                    st.error("⚠️ Please enter at least one recipient email address.")
                else:
                    # Email validation
                    recipients = [
                        email.strip()
                        for email in email_input.split(",")
                        if email.strip()
                    ]
                    invalid_emails = []

                    import re

                    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

                    for email in recipients:
                        if not re.match(email_pattern, email):
                            invalid_emails.append(email)

                    if invalid_emails:
                        st.error(
                            f"❌ Invalid email addresses: {', '.join(invalid_emails)}"
                        )
                    else:
                        try:
                            with st.spinner("📤 Sending your travel plan..."):
                                # Initialize the email tool
                                email_tool_instance = SendEmailTool()
                                send_tool = email_tool_instance.get_send_email_tool()

                                # Use the proper LangChain tool calling method
                                result = send_tool.run(
                                    {
                                        "to": recipients,
                                        "subject": subject,
                                        "body": "Hi,\n\nAttached is your AI-generated travel plan. We hope you have an amazing trip!\n\nBest regards,\nTravel Bot 🤖",
                                        "file_path": st.session_state.travel_plan_filename,
                                    }
                                )

                                st.session_state.email_sent = True
                                st.session_state.email_result = result
                                st.rerun()  # Refresh to show the result

                        except Exception as e:
                            st.session_state.email_sent = True
                            st.session_state.email_result = (
                                f"❌ Failed to send email: {str(e)}"
                            )
                            st.rerun()  # Refresh to show the error

        # Email status in the email tab with better styling
        if st.session_state.email_sent:
            if "✅" in st.session_state.email_result:
                st.balloons()  # Celebration animation
                st.success(f"🎉 {st.session_state.email_result}")
            elif "❌" in st.session_state.email_result:
                st.error(st.session_state.email_result)
            else:
                st.info(st.session_state.email_result)

            # Reset email status with better styling
            col1, col2, col3 = st.columns([1, 1, 1])
            with col2:
                if st.button(
                    "🔄 Send Another Email", key="reset_email", use_container_width=True
                ):
                    st.session_state.email_sent = False
                    st.session_state.email_result = ""
                    st.rerun()
