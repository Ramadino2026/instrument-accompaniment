#!/usr/bin/env python3
"""
Enhanced HTTP server for Instrument Accompaniment Generator
Features:
- CORS headers for cross-origin requests
- Better error handling
- Debug logging
- Auto port detection if 8000 is busy

Run: python3 server.py
Then open: http://localhost:8000 in your browser
"""

import http.server
import socketserver
import os
import sys
import socket
from pathlib import Path

def find_free_port(start_port=8000, end_port=8010):
    """Find a free port if the default is busy"""
    for port in range(start_port, end_port):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    return None

PORT = find_free_port()
if not PORT:
    print("❌ Error: No free ports available (8000-8010)")
    sys.exit(1)

DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class EnhancedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Enhanced request handler with CORS and better logging"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        """Add CORS and security headers"""
        # CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Max-Age', '3600')
        
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        
        # Cache control
        self.send_header('Cache-Control', 'public, max-age=3600')
        
        # Add MIME type for common files
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        elif self.path.endswith('.css'):
            self.send_header('Content-Type', 'text/css; charset=utf-8')
        elif self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        
        super().end_headers()
    
    def log_message(self, format, *args):
        """Custom logging with colors"""
        if args[0] == 200:
            status = "✅"
        elif args[0] == 404:
            status = "❌"
        else:
            status = "⚠️"
        
        print(f"[{self.log_date_time_string()}] {status} {format % args}")
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.end_headers()

def verify_files():
    """Verify all required files exist"""
    required_files = ['index.html', 'app.js', 'styles.css']
    missing = []
    
    for file in required_files:
        path = os.path.join(DIRECTORY, file)
        if not os.path.exists(path):
            missing.append(file)
    
    return missing

def run_server():
    """Start the HTTP server"""
    os.chdir(DIRECTORY)
    
    # Verify files
    missing = verify_files()
    if missing:
        print("\n❌ ERROR: Missing required files:")
        for f in missing:
            print(f"   - {f}")
        print(f"\n📁 Looking in: {DIRECTORY}")
        print("\nPlease ensure these files are in the same directory as server.py:")
        for f in missing:
            print(f"   {os.path.join(DIRECTORY, f)}")
        sys.exit(1)
    
    try:
        with socketserver.TCPServer(("", PORT), EnhancedHTTPRequestHandler) as httpd:
            print("\n" + "="*50)
            print("🎵 Instrument Accompaniment Generator")
            print("="*50)
            print(f"✅ Server is running!")
            print(f"🌐 Open in browser: http://localhost:{PORT}")
            print(f"📁 Serving from: {DIRECTORY}")
            print(f"\nFiles found:")
            for file in ['index.html', 'app.js', 'styles.css']:
                if os.path.exists(os.path.join(DIRECTORY, file)):
                    print(f"   ✓ {file}")
            print(f"\n⌨️  Press Ctrl+C to stop the server")
            print("="*50 + "\n")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user.")
        sys.exit(0)
        
    except OSError as e:
        if e.errno == 48 or e.errno == 98:  # Address already in use
            print(f"\n❌ Error: Port {PORT} could not be bound.")
            print(f"Try:")
            print(f"   1. Change PORT in this file")
            print(f"   2. Kill existing process: lsof -ti:{PORT} | xargs kill -9")
            print(f"   3. Wait a minute and try again")
        else:
            print(f"\n❌ Error: {e}")
        sys.exit(1)
        
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_server()
