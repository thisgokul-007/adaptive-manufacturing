import os
import sys
import time
import subprocess
import webbrowser

def main():
    print("=" * 70)
    print("  🚀 ADAPTIVE MANUFACTURING — Smart Production Prototype")
    print("  AI-Based Real-Time Machine Monitoring & Closed-Loop Control")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    # Start Flask Backend Process
    print("\n[1/2] Starting Flask Backend API Server (Port 5000)...")
    backend_proc = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=backend_dir
    )

    time.sleep(2)

    # Start Vite Frontend Process
    print("[2/2] Starting Vite Frontend Server (Port 5173)...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=frontend_dir
    )

    time.sleep(3)
    url = "http://localhost:5173"
    print("\n" + "=" * 70)
    print(f"  ✅ APPLICATION ONLINE!")
    print(f"  🌐 Access Web Interface: {url}")
    print(f"  📡 API Server:           http://localhost:5000/api/telemetry")
    print(f"  🚀 Demo Mode CTA:        Click 'Run Demo Mode' on the top header!")
    print("=" * 70 + "\n")

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down processes...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
