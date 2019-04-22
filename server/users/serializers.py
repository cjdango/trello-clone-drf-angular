from collections import defaultdict

from django.core import exceptions
import django.contrib.auth.password_validation as validators

from rest_framework import serializers

from .models import User


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
