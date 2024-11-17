from setuptools import setup, find_packages

setup(
    name='core',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[
        'graphql-core>=3.2.5',
        'PyJWT==2.8.0',
    ],
)
