from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/health-check', methods=['GET'])
def health_check():
    """
    Health-check endpoint to verify if the server is running.
    """
    try:
        # Perform a simple check to ensure the server is operational
        return jsonify({"status": "Server is running"}), 200
    except Exception as e:
        return jsonify({"error": "Server is not ready", "details": str(e)}), 500

@app.route('/generate-mail', methods=['POST'])
def generate_content():
    """
    Endpoint to generate email content using Gemini API.
    """
    data = request.get_json()
    email_type = data.get('email_type')
    recipient = data.get('recipient')
    sender_name = data.get('sender_name')
    message_content = data.get('message_content')

    prompt = f"""You are an expert email writer.

Generate a professional and polite email based on the following user input:

- Email Type: {email_type}
- Recipient: {recipient}
- Sender Name: {sender_name}
- Reason / Message: {message_content}

Write the email in formal tone with proper subject line, greeting, body, and closing.

Make sure the email is clear, concise, and respectful.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        
        # Extract raw text from Gemini response
        raw_content = response.candidates[0].content.parts[0].text
        print("RAW Response:\n", raw_content)
    
        return jsonify({"content": raw_content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0' ,port=5000)
