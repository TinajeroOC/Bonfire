import os
import jwt


class JWTValidationMiddleware:
    def __init__(self, secret_key=None):
        self.secret_key = secret_key or os.getenv('JWT_SECRET_KEY')

    def resolve(self, next, root, info, **args):
        request = info.context
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        info.context.user = None

        if not auth_header.startswith('JWT '):
            return next(root, info, **args)

        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=['HS256'],
                verify=True
            )
            info.context.user = payload
        except:
            return next(root, info, **args)

        return next(root, info, **args)
