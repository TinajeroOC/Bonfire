import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from graphene_federation import LATEST_VERSION, build_schema
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import create_refresh_token, get_token
from graphene_file_upload.scalars import Upload

from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        exclude = ['password', 'first_name', 'last_name']

    avatar_url = graphene.String()
    banner_url = graphene.String()

    def resolve_avatar_url(self, info):
        if self.avatar:
            return info.context.build_absolute_uri(self.avatar.url)
        return None

    def resolve_banner_url(self, info):
        if self.banner:
            return info.context.build_absolute_uri(self.banner.url)
        return None


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

        return CreateAccount(success=True, message=f'Successfully created an account', user=user, token=token, refresh_token=refresh_token)


class UpdateAccountProfile(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String()
        display_name = graphene.String()
        description = graphene.String()

    @login_required
    def mutate(self, info, **kwargs):
        user = info.context.user

        if 'email' in kwargs and kwargs['email'] != user.email:
            if User.objects.filter(email=kwargs['email']).exists():
                return UpdateAccountProfile(
                    success=False,
                    message='An account with that email already exists'
                )

        for field, value in kwargs.items():
            setattr(user, field, value)

        user.save()

        return UpdateAccountProfile(
            success=True,
            message='Successfully updated account profile',
            user=user
        )


class UpdateAccountMedia(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    avatar_url = graphene.String()
    banner_url = graphene.String()

    class Arguments:
        avatar = Upload()
        banner = Upload()

    @login_required
    def mutate(self, info, **kwargs):
        user = info.context.user
        allowed_extensions = ['.jpg', '.jpeg', '.png']

        avatar_url = None
        banner_url = None

        if 'avatar' in kwargs:
            avatar = kwargs['avatar']
            if not any(avatar['name'].lower().endswith(ext) for ext in allowed_extensions):
                return UpdateAccountMedia(
                    success=False,
                    message="Account avatar must be a PNG or JPEG file"
                )
            user.avatar = avatar['promise']
            avatar_url = info.context.build_absolute_uri(
                user.profile_picture.url)

        if 'banner' in kwargs:
            banner = kwargs['banner']
            if not any(banner['name'].lower().endswith(ext) for ext in allowed_extensions):
                return UpdateAccountMedia(
                    success=False,
                    message="Account banner must be a PNG or JPEG file"
                )
            user.banner = banner['promise']
            banner_url = info.context.build_absolute_uri(
                user.banner.url)

        user.save()

        return UpdateAccountMedia(
            success=True,
            message="Successfully updated account media",
            avatar_url=avatar_url,
            banner_url=banner_url
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


class Query(graphene.ObjectType):
    viewer = graphene.Field(UserType)

    @login_required
    def resolve_viewer(self, info, **kwargs):
        return info.context.user


class Mutation(graphene.ObjectType):
    auth = Auth.Field()
    verify_token = graphql_jwt.Verify.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    create_account = CreateAccount.Field()
    update_account_profile = UpdateAccountProfile.Field()
    update_account_media = UpdateAccountMedia.Field()
    update_account_password = UpdateAccountPassword.Field()


schema = build_schema(query=Query, mutation=Mutation,
                      federation_version=LATEST_VERSION)
