#!/usr/bin/env python3
"""
Simple HTTP server for testing the Instrument Accompaniment Generator
Run: python3 server.py
Then open: http://localhost:8000
"""

import http.server
import socketserver
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add CORS headers to allow audio file access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom logging
        print(f"[{self.log_date_time_string()}] {format % args}")

def run_server():
    os.chdir(DIRECTORY)
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"")
            print(f"🎵 Instrument Accompaniment Generator")
            print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print(f"✅ Server running at: http://localhost:{PORT}")
            print(f"📁 Serving files from: {DIRECTORY}")
            print(f"")
            print(f"Press Ctrl+C to stop the server")
            print(f"")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n❌ Server stopped.")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"\n❌ Error: Port {PORT} is already in use.")
            print(f"Try: python3 server.py or use a different port")
        else:
            print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_server()