# Generated by Django 5.0.7 on 2024-07-23 17:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book_reviews', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='books',
            name='about_book',
            field=models.TextField(),
        ),
    ]
