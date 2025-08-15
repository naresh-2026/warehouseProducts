from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")

# Serve React build files
@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")

# Optional: API route
@app.route("/api/hello")
def hello():
    return {"message": "Hello from Flask!"}

if __name__ == "__main__":
    app.run(debug=True)
