# Generated by Django 5.1.3 on 2024-11-17 18:29

import service.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='community',
            name='banner',
            field=models.ImageField(null=True, upload_to=service.models.community_directory_path),
        ),
        migrations.AddField(
            model_name='community',
            name='icon',
            field=models.ImageField(null=True, upload_to=service.models.community_directory_path),
        ),
    ]
