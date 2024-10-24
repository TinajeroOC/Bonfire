import subprocess
import sys
import venv
from pathlib import Path

def check_python_version():
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 12):
        print(f"Warning: Current Python version is {version.major}.{version.minor}")
        print("This project requires Python 3.12 or higher")
        sys.exit(1)

def create_venv(service_path):
    venv_path = service_path / '.venv'
    builder = venv.EnvBuilder(with_pip=True)
    builder.create(venv_path)
    return venv_path

def get_pip_path(venv_path):
    if sys.platform == 'win32':
        return venv_path / 'Scripts' / 'pip.exe'
    return venv_path / 'bin' / 'pip'

def install_requirements(requirements_path, pip_path):
    subprocess.run([str(pip_path), 'install', '-r', str(requirements_path)], check=True)

def setup_nextjs():
    web_dir = Path('web')
    if web_dir.exists():
        subprocess.run(['npm', 'install'], cwd=web_dir, check=True)

def main():
    check_python_version()
    
    services_dir = Path('services')
    if not services_dir.exists():
        print("Services directory not found")
        return

    setup_nextjs()

    for service_dir in services_dir.iterdir():
        if not service_dir.is_dir():
            continue

        requirements_file = service_dir / 'requirements.txt'
        if not requirements_file.exists():
            continue

        print(f"Setting up {service_dir.name}")
        venv_path = create_venv(service_dir)
        pip_path = get_pip_path(venv_path)
        install_requirements(requirements_file, pip_path)
        print(f"Finished setting up {service_dir.name}")

if __name__ == '__main__':
    main()