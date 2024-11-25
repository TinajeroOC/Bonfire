import os
from gql import Client
from gql.transport.requests import RequestsHTTPTransport
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def get_community_service_client(token=None):
    api_url = os.getenv('COMMUNITY_SERVICE_API_URI')

    if not api_url:
        raise ValueError(
            "COMMUNITY_SERVICE_API_URI not set in environment variables")

    headers = {}
    if token:
        headers['Authorization'] = token

    transport = RequestsHTTPTransport(
        url=api_url,
        headers=headers
    )

    return Client(transport=transport, fetch_schema_from_transport=True)
