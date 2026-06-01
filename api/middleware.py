"""Lightweight CORS middleware for the React dev server."""
from django.conf import settings
from django.http import HttpResponse


class CorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.headers.get('Origin', '')
        allowed = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])

        if request.method == 'OPTIONS' and origin in allowed:
            response = HttpResponse()
            self._apply_cors(response, origin)
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'
            response['Access-Control-Max-Age'] = '86400'
            return response

        response = self.get_response(request)
        if origin in allowed:
            self._apply_cors(response, origin)
        return response

    @staticmethod
    def _apply_cors(response, origin):
        response['Access-Control-Allow-Origin'] = origin
        response['Access-Control-Allow-Credentials'] = 'true'
