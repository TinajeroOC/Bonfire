import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from graphene_federation import LATEST_VERSION, build_schema, extends, key
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import create_refresh_token, get_token
from graphene_file_upload.scalars import Upload
from .models import User
from .graphql.client import get_post_service_server_client, get_post_service_client
from .graphql.documents import delete_user_posts_document, posts_document


@key("id")
@extends
class PostType(graphene.ObjectType):
    id = graphene.ID(required=True)


@key("id")
class UserType(DjangoObjectType):
    avatar_url = graphene.String()
    banner_url = graphene.String()
    posts = graphene.List(graphene.NonNull(PostType))

    def resolve_avatar_url(self, info):
        if self.avatar:
            return info.context.build_absolute_uri(self.avatar.url)
        return None

    def resolve_banner_url(self, info):
        if self.banner:
            return info.context.build_absolute_uri(self.banner.url)
        return None

    def resolve_posts(self, info):
        posts_data = get_post_service_client(token=info.context.headers.get('Authorization')).execute(posts_document, {
            "userId": self.id
        })
        return posts_data["posts"]["posts"]

    def __resolve_reference(self, info, **kwargs):
        return User.objects.get(id=self.id)

    class Meta:
        model = User
        exclude = ['password', 'first_name', 'last_name']


class Auth(graphql_jwt.JSONWebTokenMutation):
    refresh_token = graphene.NonNull(graphene.String)
    user = graphene.NonNull(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user, refresh_token=create_refresh_token(info.context.user))


class CreateAccount(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    user = graphene.Field(UserType)
    token = graphene.String()
    refresh_token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, email, password):
        if User.objects.filter(username=username).exists():
            return CreateAccount(success=False, message='An account with that username already exists')

        if User.objects.filter(email=email).exists():
            return CreateAccount(success=False, message='An account with that email already exists')

        user = User(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()

        token = get_token(user)
        refresh_token = create_refresh_token(user)

        return CreateAccount(success=True, message='Successfully created an account', user=user, token=token, refresh_token=refresh_token)


class UpdateAccount(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String()
        display_name = graphene.String()
        description = graphene.String()
        avatar = Upload()
        banner = Upload()
        remove_avatar = graphene.Boolean(default_value=False)
        remove_banner = graphene.Boolean(default_value=False)

    @login_required
    def mutate(self, info, email=None, display_name=None, description=None, avatar=None, banner=None, remove_avatar=False, remove_banner=False):
        user = info.context.user
        allowed_mimetypes = ['image/jpg', 'image/jpeg', 'image/png']

        if email is not None and email != user.email:
            if User.objects.filter(email=email).exists():
                return UpdateAccount(
                    success=False,
                    message='An account with that email already exists'
                )
            user.email = email

        if display_name is not None:
            user.display_name = display_name

        if description is not None:
            user.description = description

        if remove_avatar:
            user.avatar.delete(save=False)
            user.avatar = None
        elif avatar is not None:
            if not avatar['file']['mimetype'] in allowed_mimetypes:
                return UpdateAccount(
                    success=False,
                    message="Account avatar must be a PNG or JPEG file"
                )
            if user.avatar:
                try:
                    user.avatar.delete(save=False)
                except Exception as e:
                    print(f"Error deleting old avatar: {str(e)}")
            user.avatar = avatar['promise']

        if remove_banner:
            user.banner.delete(save=False)
            user.banner = None
        elif banner is not None:
            if not banner['file']['mimetype'] in allowed_mimetypes:
                return UpdateAccount(
                    success=False,
                    message="Account banner must be a PNG or JPEG file"
                )
            if user.banner:
                try:
                    user.banner.delete(save=False)
                except Exception as e:
                    print(f"Error deleting old banner: {str(e)}")
            user.banner = banner['promise']

        user.save()

        return UpdateAccount(
            success=True,
            message='Successfully updated account',
            user=user,
        )


class UpdateAccountPassword(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        current_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    @login_required
    def mutate(self, info, current_password, new_password):
        user = info.context.user

        if not user.check_password(current_password):
            return UpdateAccountPassword(success=False, message="Current password is incorrect")

        user.set_password(new_password)
        user.save()

        return UpdateAccountPassword(success=True, message="Successfully updated account password")


class DeleteAccount(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    @login_required
    def mutate(self, info, username, password):
        user = info.context.user

        if user.username != username:
            return DeleteAccount(success=False, message="Username is incorrect")

        if not user.check_password(password):
            return DeleteAccount(success=False, message="Password is incorrect")

        delete_posts_data = get_post_service_server_client().execute(delete_user_posts_document, {
            "userId": user.id
        })

        if not delete_posts_data['deletePosts']['success']:
            return DeleteAccount(
                success=False,
                message="Unable to delete user posts"
            )

        user.delete()

        return DeleteAccount(success=True, message="Successfully deleted account")


class UserResponse(graphene.ObjectType):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    user = graphene.Field(UserType)


class Query(graphene.ObjectType):
    user = graphene.Field(
        UserResponse,
        id=graphene.ID(required=False),
        username=graphene.String(required=False)
    )

    def resolve_user(self, info, id=None, username=None):
        if not id and not username:
            return UserResponse(
                success=False,
                message="Either 'id' or 'name' must be provided",
                user=None
            )

        try:
            if id:
                user = User.objects.get(id=id)
            else:
                user = User.objects.get(username=username)

            return UserResponse(
                success=True,
                message="User retrieved successfully",
                user=user
            )
        except User.DoesNotExist:
            return UserResponse(
                success=False,
                message="User not found",
                user=None
            )


class Mutation(graphene.ObjectType):
    auth = Auth.Field()
    verify_token = graphql_jwt.Verify.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    create_account = CreateAccount.Field()
    update_account = UpdateAccount.Field()
    update_account_password = UpdateAccountPassword.Field()
    delete_account = DeleteAccount.Field()


schema = build_schema(
    query=Query,
    mutation=Mutation,
    federation_version=LATEST_VERSION
)
