from django.core.exceptions import ValidationError

from django.utils.http import urlsafe_base64_decode

from .models import User


def get_user_by_uidb64(uidb64):
    try:
        # urlsafe_base64_decode() decodes to bytestring
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist, ValidationError):
        user = None
    return user