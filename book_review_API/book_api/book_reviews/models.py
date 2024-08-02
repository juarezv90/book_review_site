from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
import os




class CustomUser(AbstractUser):
    profile_image = models.ImageField(upload_to="profile_images/", null=True, blank=True, default="")

    def __str__(self) -> str:
        return self.username
 

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    book_img = models.ImageField(upload_to="images/", null=True)
    about_book = models.TextField()
    series = models.BooleanField(default=False)
    isbn = models.IntegerField(primary_key=True)
    likes = models.ManyToManyField(CustomUser, related_name="book_likes", blank=True)
    published_date = models.DateField()

    def __str__(self) -> str:
        return f'"{self.title}" by {self.author}'
    
    def number_of_likes(self):
        return self.likes.count()
    
    def delete(self, *args, **kwargs):
        if self.book_img:
            if os.path.isfile(self.book_img.path):
                os.remove(self.book_img.path)
        super().delete(*args, **kwargs)
    
    class Meta:
        permissions = [
            ('can_add_book', "Can add Book"),
        ]


class Review(models.Model):

    class Ratings(models.IntegerChoices):
        ALRIGHT = 1, "Alright"
        NOT_BAD = 2, "Not Bad"
        NEUTRAL = 3, "Neutral"
        RECOMMEND = 4, "Recommend"
        SHARE_COPY = 5, "Would Share Copy"

    book = models.ForeignKey(Book, related_name="reviews", on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    review_rating = models.IntegerField(choices=Ratings.choices, default=Ratings.ALRIGHT)
    review_text = models.TextField()
    date_reviewed = models.DateField(auto_now=True)

    def __str__(self) -> str:
        return f'{self.book} posted by {self.user} '