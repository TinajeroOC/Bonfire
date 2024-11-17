from django.core.validators import RegexValidator
from django.db import models
from typing import List


def community_directory_path(instance, filename):
    return f'{instance.id}/{filename}'


class Community(models.Model):
    name = models.CharField(max_length=20, unique=True, validators=[
        RegexValidator(
            regex=r'^[a-zA-Z0-9]+$',
            message="Name must contain only letters and numbers.",
            code='invalid_name'
        )
    ])
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=500)
    date_created = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=True)
    owner_id = models.PositiveIntegerField()
    icon = models.ImageField(
        upload_to=community_directory_path,
        null=True
    )
    banner = models.ImageField(
        upload_to=community_directory_path,
        null=True
    )

    def add_member(self, user_id: int) -> 'CommunityMembership':
        return CommunityMembership.objects.create(
            user_id=user_id,
            community=self
        )

    def remove_member(self, user_id: int) -> None:
        CommunityMembership.objects.filter(
            user_id=user_id,
            community=self
        ).delete()

    def get_member_ids(self) -> List[int]:
        return list(self.communitymembership_set.values_list('user_id', flat=True))

    def is_member(self, user_id: int) -> bool:
        return self.communitymembership_set.filter(user_id=user_id).exists()

    def member_count(self) -> int:
        return self.communitymembership_set.count()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "communities"
        ordering = ['-date_created']


class CommunityMembership(models.Model):
    user_id = models.PositiveIntegerField()
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User {self.user_id} - {self.community.name}"

    class Meta:
        unique_together = ['user_id', 'community']
        indexes = [
            models.Index(fields=['user_id']),
            models.Index(fields=['community']),
        ]
