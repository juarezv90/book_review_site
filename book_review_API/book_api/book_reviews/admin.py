from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserChangeForm, CustomUserCreationForm, BookAdminForm
from .models import CustomUser,Review, Book,ProfilePicture, Authors, Series

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['email', 'username']

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Review)
admin.site.register(ProfilePicture)


class BookAdmin(admin.ModelAdmin):
    form = BookAdminForm
    list_display = ('title', 'isbn', 'published_date', 'get_series', 'get_author')
    search_fields = ('title', 'isbn', 'series__book_series', 'authors__author')

    def get_series(self, obj):
        return obj.series.book_series if obj.series else None
    get_series.short_description = 'Series'

    def get_author(self, obj):
        return ", ".join([author.author for author in obj.authors_set.all()])
    get_author.short_description = 'Author(s)'
# Register your models here.


admin.site.register(Book, BookAdmin)
admin.site.register(Authors)
admin.site.register(Series)
