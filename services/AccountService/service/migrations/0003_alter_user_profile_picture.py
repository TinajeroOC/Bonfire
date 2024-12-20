# Generated by Django 5.1.2 on 2024-11-10 22:23

import service.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0002_alter_user_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.ImageField(null=True, upload_to=service.models.user_directory_path),
        ),
    ]
