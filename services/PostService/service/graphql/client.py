import os
from gql import Client
from gql.transport.requests import RequestsHTTPTransport
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def get_community_service_client(token=None):
    api_url = os.getenv('COMMUNITY_SERVICE_API_URL')

    if not api_url:
        raise ValueError(
            "COMMUNITY_SERVICE_API_URL not set in environment variables")

    headers = {}
    if token:
        headers['Authorization'] = token

    transport = RequestsHTTPTransport(
        url=api_url,
        headers=headers
    )

    return Client(transport=transport, fetch_schema_from_transport=True)


def get_comment_service_client(token=None):
    api_url = os.getenv('COMMENT_SERVICE_API_URL')

    if not api_url:
        raise ValueError(
            "COMMENT_SERVICE_API_URL not set in environment variables")

    headers = {}
    if token:
        headers['Authorization'] = token

    transport = RequestsHTTPTransport(
        url=api_url,
        headers=headers
    )

    return Client(transport=transport, fetch_schema_from_transport=True)


def get_comment_service_server_client():
    api_url = os.getenv('COMMENT_SERVICE_API_URL')
    server_secret_key = os.getenv('SERVER_SECRET_KEY')

    if not api_url:
        raise ValueError(
            "COMMENT_SERVICE_API_URL not set in environment variables")

    if not server_secret_key:
        raise ValueError(
            "SERVER_SECRET_KEY not set in environment variables")

    headers = {}
    headers['X-Server-Secret'] = server_secret_key

    transport = RequestsHTTPTransport(
        url=api_url,
        headers=headers
    )

    return Client(transport=transport, fetch_schema_from_transport=True)
