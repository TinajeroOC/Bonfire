from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models


def user_directory_path(instance, filename):
    return f'{instance.id}/{filename}'


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError('Field username cannot be null.')

        if not email:
            raise ValueError('Fied email cannot be null.')

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = models.CharField(
        max_length=20,
        unique=True,
        validators=[UnicodeUsernameValidator(regex=r'[a-zA-Z0-9]+')],
    )

    email = models.EmailField(
        max_length=255,
        null=False,
        unique=True,
    )

    profile_picture = models.ImageField(
        upload_to=user_directory_path,
        null=True
    )

    first_name = None
    last_name = None

    objects = UserManager()
