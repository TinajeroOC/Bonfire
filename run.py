import os
import signal
import subprocess
import sys
from pathlib import Path

processes = []
running = True


def get_python_path(service_path):
    service_path = service_path.resolve()
    if sys.platform == 'win32':
        return service_path / '.venv' / 'Scripts' / 'python.exe'
    return service_path / '.venv' / 'bin' / 'python'


def run_django_service(service_path):
    python_path = get_python_path(service_path)
    if not python_path.exists():
        print(f"Virtual environment not found for {
              service_path.name}. Please run setup script first.")
        print(f"Looking for Python at: {python_path}")
        return None

    process = subprocess.Popen(
        [str(python_path), str(service_path / 'manage.py'), 'runserver'],
        cwd=str(service_path),
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
        ['npm', 'run', 'dev'],
        cwd=str(web_dir),
        env=os.environ.copy()
    )
    return process


def cleanup():
    for process in processes:
        if process.poll() is None:
            if sys.platform == 'win32':
                process.send_signal(signal.CTRL_C_EVENT)
            else:
                process.terminate()
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
            print(f"Starting {service_dir.name}...")
            print(f"Service directory: {service_dir.resolve()}")
            process = run_django_service(service_dir)
            if process:
                processes.append(process)
                print(f"Started {service_dir.name}")

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
                import time
                time.sleep(1)

    cleanup()


if __name__ == '__main__':
    main()
