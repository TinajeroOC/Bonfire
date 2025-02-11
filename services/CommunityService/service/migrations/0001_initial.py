# Generated by Django 5.1.3 on 2024-11-17 06:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Community',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, unique=True)),
                ('title', models.CharField(max_length=60)),
                ('description', models.TextField(max_length=200)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('is_public', models.BooleanField(default=True)),
                ('owner_id', models.PositiveIntegerField()),
            ],
            options={
                'verbose_name_plural': 'communities',
                'ordering': ['-date_created'],
            },
        ),
        migrations.CreateModel(
            name='CommunityMembership',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.PositiveIntegerField()),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('community', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='service.community')),
            ],
            options={
                'indexes': [models.Index(fields=['user_id'], name='service_com_user_id_8a33bd_idx'), models.Index(fields=['community'], name='service_com_communi_72989f_idx')],
                'unique_together': {('user_id', 'community')},
            },
        ),
    ]
