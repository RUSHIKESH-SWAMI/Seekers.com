from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from accounts.models import Profile
from api.utils import json_error, json_response, login_required_api, parse_json_body, user_to_dict

User = get_user_model()


@require_http_methods(['POST'])
def register(request):
    data = parse_json_body(request)
    if data is None:
        return json_error('Invalid JSON body')

    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip()
    password = data.get('password') or ''
    password_confirm = data.get('password_confirm') or data.get('password2') or ''
    role = data.get('role') or 'student'

    errors = {}
    if not username:
        errors['username'] = 'Username is required'
    if not email:
        errors['email'] = 'Email is required'
    if len(password) < 8:
        errors['password'] = 'Password must be at least 8 characters'
    if password != password_confirm:
        errors['password_confirm'] = 'Passwords do not match'
    if role not in ('student', 'company', 'interviewer'):
        errors['role'] = 'Invalid role'
    if User.objects.filter(username=username).exists():
        errors['username'] = 'Username already taken'
    if User.objects.filter(email=email).exists():
        errors['email'] = 'Email already registered'

    if errors:
        return json_error('Validation failed', status=400, errors=errors)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        role=role,
    )
    Profile.objects.filter(user=user).update(role=role)
    return json_response({'message': 'Account created successfully', 'user': user_to_dict(user)}, status=201)


@csrf_exempt
@require_http_methods(['POST'])
def api_login(request):
    data = parse_json_body(request)
    if data is None:
        return json_error('Invalid JSON body')

    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not username or not password:
        return json_error('Username and password are required', status=400)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return json_error('Invalid credentials', status=401)

    login(request, user)
    return json_response({'user': user_to_dict(user)})


@require_http_methods(['POST'])
@login_required_api
def api_logout(request):
    logout(request)
    return json_response({'message': 'Logged out successfully'})


@require_http_methods(['GET'])
@login_required_api
def me(request):
    return json_response({'user': user_to_dict(request.user)})
