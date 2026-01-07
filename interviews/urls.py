from django.urls import path
from . import views

urlpatterns = [
    path('set-availability/', views.set_availability, name='set_availability'),
    path('my-interviews/', views.my_interviews, name='my_interviews'),
    path('delete/<int:slot_id>/', views.delete_slot, name='delete_slot'),
    path('available-slots/', views.available_slots, name='available_slots'),
    path('book/<int:slot_id>/', views.book_interview, name='book_slot'),
    path('feedback/<int:interview_id>/', views.add_feedback, name='add_feedback'),

]
