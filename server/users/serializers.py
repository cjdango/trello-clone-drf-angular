from collections import defaultdict

from django.core import exceptions
import django.contrib.auth.password_validation as validators
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.template import loader
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from rest_framework import serializers

from .models import User



INTERNAL_RESET_SESSION_TOKEN = '_password_reset_token'

class UserAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        users = User.objects.filter(email=email)
        user = users.first()
        if not users or not user.check_password(password):
            raise serializers.ValidationError("Email/Password is incorrect. Please try again.")

        self.user = user
        return data


class UserSerializer(serializers.ModelSerializer):
    """Serializer of a user"""
    password2 = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password2']


    def validate(self, data):
        password = data['password']
        password2 = data['password2']

        errors = defaultdict(list)

        if password != password2:
            errors['password'] = ["Passwords does not match"]

        try:
            validators.validate_password(password=password, user=User)
        except exceptions.ValidationError as e:
            errors['password'] += list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def save(self):
        self.validated_data.pop('password2')
        user = User.objects.create(**self.validated_data)
        user.set_password(self.validated_data['password'])
        user.save()


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)

    def send_mail(self, subject_template_name, email_template_name,
                  context, from_email, to_email, html_email_template_name=None):
        """
        Send a django.core.mail.EmailMultiAlternatives to `to_email`.
        """
        subject = loader.render_to_string(subject_template_name, context)
        # Email subject *must not* contain newlines
        subject = ''.join(subject.splitlines())
        body = loader.render_to_string(email_template_name, context)

        email_message = EmailMultiAlternatives(subject, body, from_email, [to_email])
        if html_email_template_name is not None:
            html_email = loader.render_to_string(html_email_template_name, context)
            email_message.attach_alternative(html_email, 'text/html')

        email_message.send()


    def save(self, domain_override=None,
             subject_template_name='registration/password_reset_subject.txt',
             email_template_name='registration/password_reset_email.html',
             use_https=False, token_generator=default_token_generator,
             from_email=None, request=None, html_email_template_name=None,
             extra_email_context=None):
        """
        Generate a one-use only link for resetting password and send it to the
        user.
        """
        email = self.validated_data["email"]
        users = User.objects.filter(email__iexact=email)
        has_usable_pass_users = (u for u in users if u.has_usable_password())
        for user in has_usable_pass_users:
            if not domain_override:
                current_site = get_current_site(request)
                site_name = current_site.name
                domain = current_site.domain
            else:
                site_name = domain = domain_override
            context = {
                'email': email,
                'domain': domain,
                'site_name': site_name,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'user': user,
                'token': token_generator.make_token(user),
                'protocol': 'https' if use_https else 'http',
                **(extra_email_context or {}),
            }

            request.session[INTERNAL_RESET_SESSION_TOKEN] = context['token']

            self.send_mail(
                subject_template_name, email_template_name, context, from_email,
                email, html_email_template_name=html_email_template_name,
            )


class SetPasswordSerializer(serializers.Serializer):
    """
    A serializer that lets a user change set their password without entering the old
    password
    """
    new_password1 = serializers.CharField()
    new_password2 = serializers.CharField()

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def validate(self, data):
        password1 = data['new_password1']
        password2 = data['new_password2']

        errors = defaultdict(list)

        if password1 and password2:
            if password1 != password2:
                errors['password'] = ["Passwords does not match"]

        try:
            validators.validate_password(password=password2, user=self.user)
        except exceptions.ValidationError as e:
            errors['password'] += list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return data
    
    def save(self, commit=True):
        password = self.validated_data["new_password1"]
        self.user.set_password(password)
        if commit:
            self.user.save()
        return self.user