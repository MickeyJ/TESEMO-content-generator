# Generated by Django 4.2.17 on 2025-01-22 03:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='image',
            field=models.BinaryField(blank=True, null=True),
        ),
    ]
