# Initial PUSH 7/22

## Contents
1.[Book Review API](#bookAPI)
2.[Book Review Site](#front_end)

### Book Review API {#bookAPI}

Built using django restframe work. User are able to create accounts and give reviews of books in the database. Admin user has abilities to delete any user, review, modify and delete reviews left by other users and ability to add new books to data base.

With being able to add books and users, backend is able to handle uploading images to server to render to page.

| API Endpoint                                                | Description                                                                                                                                                                 |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| admin/                                                      | main admin page for Django disabled at production.                                                                                                                          |
| api/token/ [name='token_obtain_pair']                       | endpoint to get [token](#token_json) for user sign in.                                                                                                                      |
| api/token/refresh/ [name='token_refresh']                   | endpoint to request refresh of user token using reset token provided at time of sign in.                                                                                    |
| register/ [name='register']                                 | [registration](#registration_json) endpoint.                                                                                                                                |
| api/books/                                                  | returns list of books from back end with **GET** request, if used is admin and provides authorized token in header, **POST** request to endpoint will add book to databases |
| books/<int:isbn> [name='book_detail']                       | takes ISBN into parameter and return [full book details in json](#full_book_details)                                                                                        |
| books/<int:isbn>/reviews/ [name='book-reviews']             | used to get [reviews](#reviews) for ISBN of book being passed                                                                                                               |
| books/<int:isbn>/makereviews/ [name='create_delete_review'] | used to [create review](#create_review) on single book, requires **POST** request to contain the user's token in the header be authed in teh backend to be added            |

- images being uploaded will be saved to server and path to image will be stored in database.

### Token Json {#token_json}

```
{
    "username":"username",
    "password":"password"
}
```

returns

```
{
    "reset":"generated token",
    "access":"generated token" //This needs to be used for certain site operations
}
```

### User Registration Json {#registration_json}

```
{
    "username":"username",
    "first_name":"first_name",
    "last_name":"last_name",
    "email":"email",
    "password":"password",
    "user_image":"optional image upload"
}
```

### Full single Book Page {#full*book*}

returns:

```
{
    "isbn": isbn catalog number,
    "number_of_likes": 0,
    "title": "title",
    "author": "author",
    "book_img": "url to image",
    "about_book": "details about the book",
    "series": false
}
```

**POST Request**
uses same json template above to add book but requires header to contain access token that has not expired.

### Reviews {#reviews}

Sample Review list Data; is returned as an array:

```
[
    {
        "id": 9,
        "user": "testuser",
        "review_rating": 5,
        "review_text": "Author share the most traumatizing parts ...",
        "date_reviewed": "2024-07-26",
        "book": 9781558743663
    },
    {
        "id": 10,
        "user": "admin",
        "review_rating": 4,
        "review_text": "Just an emotional masterpiece, so happy he..",
        "date_reviewed": "2024-07-26",
        "book": 9781558743663
    },
    {
        "id": 11,
        "user": "admin",
        "review_rating": 3,
        "review_text": "Stands at just a glance of problems",
        "date_reviewed": "2024-07-26",
        "book": 9781558743663
    }
]
```

### Creating a Review {#create_review}

Needs to be a post request containing an active user token and should follow json structure below
```
{
"id": 11,
"user": "admin",
"review_rating": 3,
"review_text": "Stands at just a glance of problems",
"date_reviewed": "2024-07-26",
"book": 9781558743663
}
```
* id, user, date_reviewed, and ISBN should be added either on the back end or through frontend process such as in variable fetch request.