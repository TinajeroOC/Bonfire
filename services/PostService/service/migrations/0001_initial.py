# Generated by Django 5.1.3 on 2024-11-25 07:53

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('poster_id', models.CharField(max_length=255)),
                ('community_id', models.CharField(max_length=255)),
                ('title', models.CharField(max_length=300, validators=[django.core.validators.MinLengthValidator(1, 'Title must be at least 1 character long')])),
                ('body', models.TextField(max_length=10000)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'posts',
                'ordering': ['-created_at'],
            },
        ),
    ]
