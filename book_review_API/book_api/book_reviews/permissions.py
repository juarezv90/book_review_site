from rest_framework import permissions

class BookPrivileges(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['list', 'retrieve']:
            return True
        if view.action == 'create':
            return request.user.has_perm('book_reviews.can_add_book')
        return True