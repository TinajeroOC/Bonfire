import os
import signal
import subprocess
import sys
import time
from pathlib import Path

processes = []
running = True

SERVICE_PORTS = {
    'AccountService': 8000,
    'CommunityService': 8001,
    'PostService': 8002
}

DEFAULT_PORT = 8080


def get_python_path(service_path):
    service_path = service_path.resolve()
    if sys.platform == 'win32':
        return service_path / '.venv' / 'Scripts' / 'python.exe'
    return service_path / '.venv' / 'bin' / 'python'


def run_django_service(service_path, port):
    python_path = get_python_path(service_path)
    if not python_path.exists():
        print(f"Virtual environment not found for {
              service_path.name}. Please run setup script first.")
        print(f"Looking for Python at: {python_path}")
        return None

    process = subprocess.Popen(
        [str(python_path), str(service_path / 'manage.py'),
         'runserver', f'127.0.0.1:{port}'],
        cwd=str(service_path),
        env=os.environ.copy()
    )
    print(f"Started {service_path.name} on 127.0.0.1:{port}")
    return process


def run_gateway():
    root_dir = Path(__file__).parent.resolve()
    gateway_dir = root_dir / 'gateway'
    if not gateway_dir.exists():
        print("Gateway directory not found")
        return None

    time.sleep(5)
    process = subprocess.Popen(
        ['npm', 'run', 'start'],
        cwd=str(gateway_dir),
        env=os.environ.copy()
    )
    return process


def run_nextjs():
    root_dir = Path(__file__).parent.resolve()
    web_dir = root_dir / 'web'
    if not web_dir.exists():
        print("Web directory not found")
        return None

    process = subprocess.Popen(
        ['npm', 'run', 'codegen'],
        cwd=str(web_dir),
        env=os.environ.copy()
    )
    process = subprocess.Popen(
        ['npm', 'run', 'dev'],
        cwd=str(web_dir),
        env=os.environ.copy()
    )
    return process


def cleanup():
    for process in processes:
        if process and process.poll() is None:
            try:
                if sys.platform == 'win32':
                    process.send_signal(signal.CTRL_C_EVENT)
                else:
                    process.terminate()
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()


def signal_handler(signum, frame):
    global running
    print("\nShutting down all services...")
    running = False
    cleanup()
    sys.exit(0)


def main():
    global running
    root_dir = Path(__file__).parent.resolve()
    services_dir = root_dir / 'services'

    if not services_dir.exists():
        print(f"Services directory not found at: {services_dir}")
        return

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    for service_dir in services_dir.iterdir():
        if not service_dir.is_dir():
            continue

        if (service_dir / 'manage.py').exists():
            port = SERVICE_PORTS.get(service_dir.name, DEFAULT_PORT)
            print(f"Starting {service_dir.name} on port {port}...")
            print(f"Service directory: {service_dir.resolve()}")
            process = run_django_service(service_dir, port)
            if process:
                processes.append(process)
            time.sleep(3)

    print("Starting Apollo gateway...")
    gateway_process = run_gateway()
    if gateway_process:
        processes.append(gateway_process)
        print("Started Apollo gateway")
    time.sleep(3)

    print("Starting NextJS frontend...")
    frontend_process = run_nextjs()
    if frontend_process:
        processes.append(frontend_process)
        print("Started NextJS frontend")

    while running:
        for process in processes:
            if process.poll() is not None:
                print("One of the services has terminated. Shutting down...")
                running = False
                break
        if running:
            try:
                signal.pause()
            except AttributeError:
                time.sleep(1)

    cleanup()


if __name__ == '__main__':
    main()
