from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.tokens import default_token_generator

from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny

from .models import User, ResetPassToken
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
    permission_classes = (AllowAny,)

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
    permission_classes = (AllowAny,)

    def password_reset(self, *args, **kwargs):
        """Used for requesting password reset"""
        client_addr = self.request.META['REMOTE_ADDR']
        serializer = PasswordResetSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save(request=self.request, domain_override=f'{client_addr}:4200')
            return Response(status=200)
        return Response(serializer.errors, status=400)
   
    def password_reset_confirm(self, *args, **kwargs):
        assert 'uidb64' in kwargs and 'token' in kwargs

        user = get_user_by_uidb64(kwargs['uidb64'])
        if user is not None:
            try:
                reset_token_obj = ResetPassToken.objects.get(uid=kwargs['uidb64'], token=kwargs['token'])
                reset_token = reset_token_obj.token
                if default_token_generator.check_token(user, reset_token):
                    serializer = SetPasswordSerializer(data=self.request.data, user=user)
                    if serializer.is_valid():
                        serializer.save()
                        reset_token_obj.delete()
                        return Response(status=200)
                    return Response(serializer.errors, status=400)
            except ResetPassToken.DoesNotExist:
                pass
        return Response({'non_field_errors': ['Sorry, something went wrong. Try requesting a new reset link.']}, status=400)