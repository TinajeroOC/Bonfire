# Generated by Django 5.1.3 on 2024-11-19 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0003_alter_community_description_alter_community_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='community',
            name='owner_id',
            field=models.CharField(max_length=255),
        ),
    ]
