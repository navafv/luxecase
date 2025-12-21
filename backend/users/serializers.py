from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User Registration and Profile.
    Hides the password field in responses.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'phone_number']

    def create(self, validated_data):
        # We override create to hash the password correctly
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customizes the JWT Token response to include user details (name, email)
    so the Frontend doesn't need a separate call to fetch 'who am I'.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_name'] = f"{self.user.first_name} {self.user.last_name}"
        data['email'] = self.user.email
        data['is_admin'] = self.user.is_staff
        return data