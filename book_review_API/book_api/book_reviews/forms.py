from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser,Book, Authors, Series
from django import forms

class CustomUserCreationForm(UserCreationForm):

    class Meta: 
        model = CustomUser
        fields = ('username', 'email')
        fieldsets = (
            (None, {
                'fields': (
                    'username', 'email', 'password1', 'password2',
                ),
            }),
        )

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('username', 'email')

class BookAdminForm(forms.ModelForm):
    author_name = forms.CharField(max_length=200, label="Author Name", required=True)
    book_series_name = forms.CharField(max_length=200, label="Series Name", required=False)
    number_in_series = forms.IntegerField(label="Number in Series", required=False)

    class Meta:
        model = Book
        fields = ['title', 'book_img', 'about_book', 'isbn', 'published_date', 'author_name', 'book_series_name', 'number_in_series']

    def clean(self):
        cleaned_data = super().clean()
        author_name = cleaned_data.get("author_name")
        book_series_name = cleaned_data.get("book_series_name")
        number_in_series = cleaned_data.get("number_in_series")

        # Ensure the author exists or create it
        if author_name:
            author, created = Authors.objects.get_or_create(author=author_name)
            cleaned_data['author'] = author

        # Ensure the series exists or create it
        if book_series_name:
            series, created = Series.objects.get_or_create(book_series=book_series_name)
            cleaned_data['series'] = series

            # Validate the number in series
            if number_in_series is not None:
                if Book.objects.filter(series=series, number_in_series=number_in_series).exists():
                    self.add_error('number_in_series', f'A book with number {number_in_series} already exists in the series "{book_series_name}".')

        return cleaned_data

    def save(self, commit=True):
        book = super().save(commit=False)

        # Assign the author and series (if any)
        author = self.cleaned_data.get('author')
        series = self.cleaned_data.get('series')

        if author:
            author.books_written.add(book)

        if series:
            book.series = series
            book.number_in_series = self.cleaned_data.get('number_in_series')

        if commit:
            book.save()

        return book
