# Generated by Django 5.1.3 on 2024-11-28 03:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0006_alter_community_name_alter_community_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='community',
            name='is_public',
        ),
    ]
