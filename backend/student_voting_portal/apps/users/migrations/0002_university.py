# Generated by Django 4.2.1 on 2023-05-08 19:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="University",
            fields=[
                ("create_time", models.DateTimeField(auto_now_add=True)),
                ("update_time", models.DateTimeField(auto_now=True)),
                ("id", models.SmallAutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=64)),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
