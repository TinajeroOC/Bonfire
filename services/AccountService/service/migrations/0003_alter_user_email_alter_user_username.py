# Generated by Django 5.1.2 on 2024-11-04 23:05

import django.contrib.auth.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0002_remove_user_first_name_remove_user_last_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=255, unique=True, verbose_name='email address'),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=20, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator(regex='[a-zA-Z0-9]+')], verbose_name='username'),
        ),
    ]