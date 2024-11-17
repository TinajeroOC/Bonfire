import graphene
from graphene_django import DjangoObjectType
from graphene_federation import LATEST_VERSION, build_schema
from graphene_file_upload.scalars import Upload
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from core.decorators import login_required
from .models import Community


class CommunityType(DjangoObjectType):
    icon_url = graphene.String()
    banner_url = graphene.String()
    member_count = graphene.Int()
    is_member = graphene.Boolean()
    is_owner = graphene.Boolean()

    def resolve_icon_url(self, info):
        if self.icon:
            return info.context.build_absolute_uri(self.icon.url)
        return None

    def resolve_banner_url(self, info):
        if self.banner:
            return info.context.build_absolute_uri(self.banner.url)
        return None

    def resolve_member_count(self, info):
        return self.member_count()

    def resolve_is_member(self, info):
        return self.is_member(info.context.user['id'])

    def resolve_is_owner(self, info):
        return self.owner_id == info.context.user['id']

    class Meta:
        model = Community


class CreateCommunity(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    community = graphene.Field(CommunityType)

    class Arguments:
        name = graphene.String(required=True)
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        is_public = graphene.Boolean(default_value=True)
        icon = Upload()
        banner = Upload()

    @login_required
    def mutate(self, info, name, title, description, is_public, icon, banner):
        allowed_mimetypes = ['image/jpg', 'image/jpeg', 'image/png']

        try:
            community = Community.objects.create(
                name=name,
                title=title,
                description=description,
                is_public=is_public,
                owner_id=info.context.user['id']
            )

            if icon:
                if not icon['file']['mimetype'] in allowed_mimetypes:
                    return CreateCommunity(
                        success=False,
                        message="Community icon must be a PNG or JPEG file"
                    )
                if community.icon:
                    try:
                        community.icon.delete(save=False)
                    except Exception as e:
                        print(f"Error deleting old icon: {str(e)}")
                community.icon = icon['promise']

            if banner:
                if not banner['file']['mimetype'] in allowed_mimetypes:
                    return CreateCommunity(
                        success=False,
                        message="Community banner must be a PNG or JPEG file"
                    )
                if community.banner:
                    try:
                        community.banner.delete(save=False)
                    except Exception as e:
                        print(f"Error deleting old banner: {str(e)}")
                community.banner = banner['promise']

            community.add_member(info.context.user['id'])

            community.save()

            return CreateCommunity(
                success=True,
                message="Community created successfully",
                community=community
            )
        except IntegrityError:
            return CreateCommunity(
                success=False,
                message="A community with this name already exists",
                community=None
            )
        except ValidationError as e:
            return CreateCommunity(
                success=False,
                message=str(e),
                community=None
            )


class UpdateCommunity(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    community = graphene.Field(CommunityType)

    class Arguments:
        community_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        is_public = graphene.Boolean()
        icon = Upload()
        banner = Upload()
        remove_icon = graphene.Boolean(default_value=False)
        remove_banner = graphene.Boolean(default_value=False)

    @login_required
    def mutate(self, info, community_id, title=None, description=None,
               is_public=None, icon=None, banner=None, remove_icon=False, remove_banner=False):
        allowed_mimetypes = ['image/jpg', 'image/jpeg', 'image/png']

        try:
            community = Community.objects.get(id=community_id)

            if community.owner_id != info.context.user['id']:
                return UpdateCommunity(
                    success=False,
                    message="Only the community owner can update the community",
                    community=None
                )

            if title is not None:
                community.title = title

            if description is not None:
                community.description = description

            if is_public is not None:
                community.is_public = is_public

            if remove_icon:
                community.icon.delete(save=False)
                community.icon = None
            elif icon:
                if not icon['file']['mimetype'] in allowed_mimetypes:
                    return CreateCommunity(
                        success=False,
                        message="Community icon must be a PNG or JPEG file"
                    )
                if community.icon:
                    try:
                        community.icon.delete(save=False)
                    except Exception as e:
                        print(f"Error deleting old icon: {str(e)}")
                community.icon = icon['promise']

            if remove_banner:
                community.banner.delete(save=False)
                community.banner = None
            elif banner:
                if not banner['file']['mimetype'] in allowed_mimetypes:
                    return CreateCommunity(
                        success=False,
                        message="Community banner must be a PNG or JPEG file"
                    )
                if community.banner:
                    try:
                        community.banner.delete(save=False)
                    except Exception as e:
                        print(f"Error deleting old banner: {str(e)}")
                community.banner = banner['promise']

            community.save()

            return UpdateCommunity(
                success=True,
                message="Community updated successfully",
                community=community
            )

        except Community.DoesNotExist:
            return UpdateCommunity(
                success=False,
                message="Community not found",
                community=None
            )
        except ValidationError as e:
            return UpdateCommunity(
                success=False,
                message=str(e),
                community=None
            )


class JoinCommunity(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        community_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, community_id):
        try:
            community = Community.objects.get(id=community_id)

            if not community.is_public:
                return JoinCommunity(
                    success=False,
                    message="This community is private"
                )

            if community.is_member(info.context.user['id']):
                return JoinCommunity(
                    success=False,
                    message="You are already a member of this community"
                )

            community.add_member(info.context.user['id'])

            return JoinCommunity(
                success=True,
                message="Successfully joined the community"
            )
        except Community.DoesNotExist:
            return JoinCommunity(
                success=False,
                message="Community not found"
            )


class LeaveCommunity(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        community_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, community_id):
        try:
            community = Community.objects.get(id=community_id)

            if not community.is_member(info.context.user['id']):
                return LeaveCommunity(
                    success=False,
                    message="You are not a member of this community"
                )

            if community.owner_id == info.context.user['id']:
                return LeaveCommunity(
                    success=False,
                    message="Community owner cannot leave the community"
                )

            community.remove_member(info.context.user['id'])

            return LeaveCommunity(
                success=True,
                message="Successfully left the community"
            )
        except Community.DoesNotExist:
            return LeaveCommunity(
                success=False,
                message="Community not found"
            )


class DeleteCommunity(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        community_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, community_id):
        try:
            community = Community.objects.get(id=community_id)

            if community.owner_id != info.context.user['id']:
                return DeleteCommunity(
                    success=False,
                    message="Only the community owner can delete the community"
                )

            if community.icon:
                community.icon.delete(save=False)
            if community.banner:
                community.banner.delete(save=False)

            community.delete()

            return DeleteCommunity(
                success=True,
                message="Community deleted successfully"
            )

        except Community.DoesNotExist:
            return DeleteCommunity(
                success=False,
                message="Community not found"
            )
        except Exception as e:
            return DeleteCommunity(
                success=False,
                message=f"Failed to delete community: {str(e)}"
            )


class Query(graphene.ObjectType):
    communities = graphene.List(CommunityType)
    community = graphene.Field(CommunityType, id=graphene.ID(required=True))
    my_communities = graphene.List(CommunityType)

    @login_required
    def resolve_communities(self, info):
        return Community.objects.filter(is_public=True)

    @login_required
    def resolve_community(self, info, id):
        try:
            community = Community.objects.get(id=id)
            if community.is_public or community.is_member(info.context.user['id']):
                return community
            return None
        except Community.DoesNotExist:
            return None

    @login_required
    def resolve_my_communities(self, info):
        user_id = info.context.user['id']
        member_communities = Community.objects.filter(
            communitymembership__user_id=user_id
        )
        return member_communities


class Mutation(graphene.ObjectType):
    create_community = CreateCommunity.Field()
    update_community = UpdateCommunity.Field()
    delete_community = DeleteCommunity.Field()
    join_community = JoinCommunity.Field()
    leave_community = LeaveCommunity.Field()


schema = build_schema(
    query=Query,
    mutation=Mutation,
    federation_version=LATEST_VERSION
)
