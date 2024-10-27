import subprocess
import sys
import venv
import os
from pathlib import Path


def check_python_version():
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 12):
        print(f"Warning: Current Python version is {
              version.major}.{version.minor}")
        print("This project requires Python 3.12 or higher")
        sys.exit(1)


def create_venv(service_path):
    venv_path = service_path / '.venv'
    print(f"Creating virtual environment at {venv_path}")
    builder = venv.EnvBuilder(with_pip=True, upgrade_deps=True)
    builder.create(venv_path)
    return venv_path


def get_python_path(venv_path):
    if sys.platform == 'win32':
        return venv_path / 'Scripts' / 'python.exe'

    python_names = ['python3', 'python']
    bin_dir = venv_path / 'bin'

    for name in python_names:
        python_path = bin_dir / name
        if python_path.exists():
            print(f"Found Python executable at: {python_path}")
            os.chmod(python_path, 0o755)
            return python_path

    return bin_dir / 'python3'


def install_requirements(requirements_path, python_path):
    pip_cmd = [str(python_path), '-m', 'pip', 'install',
               '-r', str(requirements_path)]
    print(f"Installing requirements using: {' '.join(pip_cmd)}")
    subprocess.run(pip_cmd, check=True, env=os.environ.copy())


def run_django_migrations(service_dir, python_path):
    try:
        service_dir = service_dir.absolute()
        python_path = python_path.absolute()

        print(f"\nVerifying paths for Django migrations:")
        print(f"Service directory: {service_dir}")
        print(f"Python path: {python_path}")
        print(f"manage.py exists: {(service_dir / 'manage.py').exists()}")

        env = os.environ.copy()
        env['PYTHONPATH'] = str(service_dir)

        print("Installing Django...")
        subprocess.run(
            [str(python_path), '-m', 'pip', 'install', 'django'],
            check=True,
            env=env
        )

        print("Running makemigrations...")
        subprocess.run(
            [str(python_path), 'manage.py', 'makemigrations'],
            cwd=str(service_dir),
            check=True,
            env=env
        )
        print(f"Successfully made migrations for {service_dir.name}")

        print("Running migrate...")
        subprocess.run(
            [str(python_path), 'manage.py', 'migrate'],
            cwd=str(service_dir),
            check=True,
            env=env
        )
        print(f"Successfully applied migrations for {service_dir.name}")

    except subprocess.CalledProcessError as e:
        print(f"Error in Django operations: {e}")
        print(f"Command output: {e.output if hasattr(
            e, 'output') else 'No output'}")
        raise
    except Exception as e:
        print(f"Unexpected error in Django operations: {e}")
        raise


def setup_nextjs():
    web_dir = Path('web')
    if web_dir.exists():
        try:
            print("Setting up Next.js dependencies...")
            subprocess.run(['npm', 'install'], cwd=web_dir, check=True)
            print("Successfully installed Next.js dependencies")
        except subprocess.CalledProcessError as e:
            print(f"Error setting up Next.js: {e}")
            raise


def setup_gateway():
    gateway_dir = Path('gateway')
    if gateway_dir.exists():
        try:
            print("Setting up Apollo gateway dependencies...")
            subprocess.run(['npm', 'install'], cwd=gateway_dir, check=True)
            print("Successfully installed Apollo gateway dependencies")
        except subprocess.CalledProcessError as e:
            print(f"Error setting up Apollo gateway: {e}")
            raise


def main():
    try:
        check_python_version()

        services_dir = Path('services').absolute()
        if not services_dir.exists():
            print("Services directory not found")
            return

        setup_gateway()

        setup_nextjs()

        for service_dir in services_dir.iterdir():
            if not service_dir.is_dir():
                continue

            requirements_file = service_dir / 'requirements.txt'
            if not requirements_file.exists():
                print(f"Skipping {
                      service_dir.name}: no requirements.txt found")
                continue

            print(f"\nSetting up {service_dir.name}")
            venv_path = create_venv(service_dir)
            python_path = get_python_path(venv_path)

            if not python_path.exists():
                print(f"Warning: Python executable not found at {python_path}")
                print("Attempting to find alternative Python executable...")
                bin_dir = venv_path / 'bin'
                if bin_dir.exists():
                    print("Contents of bin directory:")
                    for file in bin_dir.iterdir():
                        print(f"  {file.name}")
                raise FileNotFoundError(
                    f"Python executable not found at {python_path}")

            install_requirements(requirements_file, python_path)
            run_django_migrations(service_dir, python_path)
            print(f"Finished setting up {service_dir.name}")

    except Exception as e:
        print(f"Setup failed: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
