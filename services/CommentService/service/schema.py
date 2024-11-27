import graphene
from graphene_django import DjangoObjectType
from graphene_federation import LATEST_VERSION, build_schema, key, extends
from core.decorators import login_required, server_only
from .models import Comment
from .graphql.documents import post_document
from .graphql.client import get_post_service_client


@key("id")
@extends
class UserType(graphene.ObjectType):
    id = graphene.ID(required=True)


@key("id")
class CommentType(DjangoObjectType):
    is_commenter = graphene.Boolean()
    user = graphene.Field(UserType)

    def resolve_is_commenter(self, info):
        if info.context.user is not None:
            return self.is_commenter(info.context.user['id'])
        return False

    def resolve_user(self, info):
        return UserType(id=self.commenter_id)

    def __resolve_reference(self, info, **kwargs):
        return Comment.objects.get(id=self.id)

    class Meta:
        model = Comment


class CreateComment(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    comment = graphene.Field(CommentType)

    class Arguments:
        post_id = graphene.ID(required=True)
        body = graphene.String(required=True)

    @login_required
    def mutate(self, info, post_id, body):
        try:
            post_data = get_post_service_client(token=info.context.headers.get('Authorization')).execute(post_document, {
                "id": post_id
            })

            if not post_data["post"]["post"]:
                return CreateComment(success=False, message="Cannot create comments for a nonexistent post")

            comment = Comment.objects.create(
                commenter_id=info.context.user['id'],
                post_id=post_id,
                body=body
            )

            return CreateComment(success=True, message="Comment created successfully", comment=comment)
        except Exception as e:
            return CreateComment(success=False, message=f"Failed to create comment: {str(e)}", comment=None)


class UpdateComment(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    comment = graphene.Field(CommentType)

    class Arguments:
        comment_id = graphene.ID(required=True)
        body = graphene.String(required=True)

    @login_required
    def mutate(self, info, comment_id, body):
        try:
            comment = Comment.objects.get(id=comment_id)

            if comment.commenter_id != info.context.user['id']:
                return UpdateComment(success=False, message="You do not have permission to update this comment", comment=None)

            comment.body = body

            comment.save()

            return UpdateComment(success=True, message="Comment updated successfully", comment=comment)
        except Comment.DoesNotExist:
            return UpdateComment(success=False, message="Comment not found", comment=None)
        except Exception as e:
            return UpdateComment(success=False, message=f"Failed to update comment: {str(e)}", comment=None)


class DeleteComment(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        comment_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)

            if comment.commenter_id != info.context.user['id']:
                return DeleteComment(success=False, message="You do not have permission to delete this comment")

            comment.delete()

            return DeleteComment(success=True, message="Comment deleted successfully")
        except Comment.DoesNotExist:
            return DeleteComment(success=False, message="Comment not found")
        except Exception as e:
            return DeleteComment(success=False, message=f"Failed to delete comment: {str(e)}")


class DeleteComments(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        post_id = graphene.ID()
        user_id = graphene.ID()

    @server_only
    def mutate(self, info, post_id=None, user_id=None):
        try:
            filters = {}

            if post_id:
                filters['post_id'] = post_id
            if user_id:
                filters['commenter_id'] = user_id

            comments_to_delete = Comment.objects.filter(**filters)

            deleted_count, _ = comments_to_delete.delete()

            message = f"Successfully deleted {deleted_count} comments"

            return DeleteComments(success=True, message=message)

        except Exception as e:
            return DeleteComments(success=False, message=f"Failed to delete comments: {str(e)}")


class CommentResponse(graphene.ObjectType):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    comment = graphene.Field(CommentType)


class CommentsResponse(graphene.ObjectType):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    comments = graphene.List(graphene.NonNull(CommentType))


class Query(graphene.ObjectType):
    comment = graphene.Field(CommentResponse, id=graphene.ID(required=True))
    comments = graphene.Field(
        CommentsResponse,
        post_id=graphene.ID(),
        user_id=graphene.ID()
    )

    def resolve_comment(self, info, id):
        try:
            comment = Comment.objects.get(id=id)
            return CommentResponse(success=True, message="Comment retrieved successfully", comment=comment)
        except Comment.DoesNotExist:
            return CommentsResponse(success=False, message="Comment not found", comment=None)

    def resolve_comments(self, info, post_id=None, user_id=None):
        try:
            filters = {}
            if post_id:
                filters['post_id'] = post_id
            if user_id:
                filters['commenter_id'] = user_id

            comments = Comment.objects.filter(**filters)
            return CommentsResponse(success=True, message="Comments retrieved successfully", comments=list(comments))
        except Exception as e:
            return CommentsResponse(success=False, message=f"Failed to retrieve comments: {str(e)}", comments=[])


class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field()
    update_comment = UpdateComment.Field()
    delete_comment = DeleteComment.Field()
    delete_comments = DeleteComments.Field()


schema = build_schema(query=Query, mutation=Mutation,
                      federation_version=LATEST_VERSION)
