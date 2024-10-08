from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
import os




class CustomUser(AbstractUser):
    def __str__(self) -> str:
        return self.username
 
class Series(models.Model):
    book_series = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.book_series}'

class Book(models.Model):
    title = models.CharField(max_length=200)
    book_img = models.ImageField(upload_to="images/", null=True)
    about_book = models.TextField()
    series = models.ForeignKey(Series, on_delete=models.SET_NULL, null=True, blank=True)
    number_in_series = models.IntegerField(null=True, blank=True)
    isbn = models.IntegerField(primary_key=True)
    likes = models.ManyToManyField(CustomUser, related_name="book_likes", blank=True)
    published_date = models.DateField()

    def __str__(self) -> str:
        return f'"{self.title}"'
    
    def number_of_likes(self):
        return self.likes.count()
    
    def delete(self, *args, **kwargs):
        if self.book_img:
            if os.path.isfile(self.book_img.path):
                os.remove(self.book_img.path)
        super().delete(*args, **kwargs)
    
    class Meta:
        unique_together = ('series', 'number_in_series')
        permissions = [
            ('can_add_book', "Can add Book"),
        ]

class Authors(models.Model):
    author = models.CharField(max_length=200)
    books_written = models.ManyToManyField(Book)

    def __str__(self):
        return f'{self.author}'




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
    
class ProfilePicture(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to="profile_images/", null=True, blank=True, default="")    


