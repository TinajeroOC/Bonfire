from calendar import timegm
from datetime import datetime, timedelta


def jwt_payload(user, context=None):
    username = user.get_username()
    user_id = str(user.id)

    if hasattr(username, 'pk'):
        username = username.pk

    exp_datetime = datetime.utcnow() + timedelta(hours=1)
    exp_timestamp = timegm(exp_datetime.utctimetuple())

    payload = {
        'id': user_id,
        'username': username,
        'exp': exp_timestamp,
        'origIat': timegm(datetime.utcnow().utctimetuple())
    }

    return payload
