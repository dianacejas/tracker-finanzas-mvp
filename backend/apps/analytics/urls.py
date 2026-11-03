from django.urls import path

from . import views

urlpatterns = [
    path("summary/", views.FinancialSummaryView.as_view(), name="financial-summary"),
    path("category-breakdown/", views.CategoryBreakdownView.as_view(), name="category-breakdown"),
    path("monthly-trend/", views.MonthlyTrendView.as_view(), name="monthly-trend"),
]
