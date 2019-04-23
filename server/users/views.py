from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.tokens import default_token_generator

from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.authtoken.models import Token

from .models import User
from .serializers import (
    UserSerializer,
    UserAuthSerializer,
    PasswordResetSerializer,
    SetPasswordSerializer
)
from .utils import get_user_by_uidb64

INTERNAL_RESET_SESSION_TOKEN = '_password_reset_token'

class GuestAPI(ViewSet):
    """Guest API"""

    def list(self, *args, **kwargs):
        """lists all users
        """
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data, status=200)

    def create(self, *args, **kwargs):
        """creates a user"""
        serializer = UserSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=201)
        return Response(serializer.errors, status=400)
    
    def login(self, *args, **kwargs):
        serializer = UserAuthSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        token, created = Token.objects.get_or_create(user=user)
        user_logged_in.send(sender=user.__class__, request=self.request, user=user)
        context = {
            'token':token.key,
            'log':user.last_login,
        }
        return Response(context,status=200)


class UserAPI(ViewSet):
    """User API"""

    def password_reset(self, *args, **kwargs):
        """Used for requesting password reset"""
        serializer = PasswordResetSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save(request=self.request)
            return Response(status=200)
        return Response(serializer.errors, status=400)
   
    def password_reset_confirm(self, *args, **kwargs):
        assert 'uidb64' in kwargs and 'token' in kwargs

        user = get_user_by_uidb64(kwargs['uidb64'])
        if user is not None:
            session_token = self.request.session.get(INTERNAL_RESET_SESSION_TOKEN)
            if default_token_generator.check_token(user, session_token):
                serializer = SetPasswordSerializer(data=self.request.data, user=user)
                if serializer.is_valid():
                    serializer.save()
                    del self.request.session[INTERNAL_RESET_SESSION_TOKEN]
                    return Response(status=200)
                return Response(serializer.errors, status=400)
        return Response(status=400)