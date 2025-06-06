# -----------------------------------------------------------------------------
# Combined API Test Script for Cost Manager RESTful Web Services
# -----------------------------------------------------------------------------
# This script includes both raw HTTP request testing (outputting to a file)
# and structured unit tests using Python's pytest and requests libraries.
# It validates all required endpoints as defined in the project specification.
# -----------------------------------------------------------------------------

# Part 1: Raw request testing (writes output to file)
import sys
import requests
import datetime
import random

filename = input("filename=")
line = ""
output = open(filename, "w")
sys.stdout = output

print("== Testing Raw Endpoints ==")
print()

# Test /api/about
print("Testing GET /api/about")
print("-----------------------")
try:
    url = line + "api/about/"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(data.json())
except Exception as e:
    print("problem")
    print(e)

print()
# Test /api/report (before add)
print("Testing GET /api/report - Initial")
print("---------------------------------")
try:
    url = line + "api/report/?id=123123&year=2025&month=2"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
except Exception as e:
    print("problem")
    print(e)

print()
# Test /api/add
print("Testing POST /api/add")
print("----------------------")
try:
    url = line + "api/add/"
    data = requests.post(url, json={'userid': 123123, 'description': 'milk 9', 'category': 'food', 'sum': 8})
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
except Exception as e:
    print("problem")
    print(e)

print()
# Test /api/report (after add)
print("Testing GET /api/report - After Add")
print("-----------------------------------")
try:
    url = line + "api/report/?id=123123&year=2025&month=1"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
except Exception as e:
    print("problem")
    print(e)

# Part 2: Structured tests using pytest
BASE_URL = ""
def get_test_user_id():
    return 123123

def test_get_user_details_success():
    user_id = get_test_user_id()
    response = requests.get(f"{BASE_URL}/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert "first_name" in data
    assert "last_name" in data
    assert "id" in data
    assert "total" in data
    assert data["id"] == user_id

def test_get_user_details_not_found():
    response = requests.get(f"{BASE_URL}/users/9999999")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data

def test_add_cost_invalid_category():
    user_id = get_test_user_id()
    payload = {
        "userid": user_id,
        "description": "Test cost invalid category",
        "category": "transport",
        "sum": 50,
        "createdAt": datetime.datetime.now().isoformat()
    }
    response = requests.post(f"{BASE_URL}/add", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "error" in data and data["error"] == "Invalid category"
    assert "validCategories" in data

def test_add_cost_success():
    user_id = get_test_user_id()
    sum_value = random.randint(10, 100)
    payload = {
        "userid": user_id,
        "description": "Test cost entry",
        "category": "food",
        "sum": sum_value,
        "createdAt": datetime.datetime.now().isoformat()
    }
    response = requests.post(f"{BASE_URL}/add", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["userid"] == user_id
    assert data["description"] == payload["description"]
    assert data["category"] == payload["category"]
    assert data["sum"] == payload["sum"]

def test_add_cost_missing_fields():
    payload = { "description": "Missing fields test" }
    response = requests.post(f"{BASE_URL}/add", json=payload)
    assert response.status_code == 400
    assert "error" in response.json()

def test_add_cost_user_not_found():
    payload = {
        "userid": 9999999,
        "description": "User not found test",
        "category": "health",
        "sum": 50
    }
    response = requests.post(f"{BASE_URL}/add", json=payload)
    assert response.status_code == 404
    assert "error" in response.json()

def test_get_monthly_report_success():
    user_id = get_test_user_id()
    now = datetime.datetime.now()
    params = {
        "id": user_id,
        "year": now.year,
        "month": now.month
    }
    response = requests.get(f"{BASE_URL}/report", params=params)
    assert response.status_code == 200
    data = response.json()
    assert data["userid"] == user_id
    assert data["year"] == now.year
    assert data["month"] == now.month
    assert "costs" in data and isinstance(data["costs"], dict)
    expected_categories = ['food', 'health', 'housing', 'sport', 'education']
    for category in expected_categories:
        assert category in data["costs"]
        assert isinstance(data["costs"][category], list)

def test_get_monthly_report_missing_params():
    params = { "id": get_test_user_id(), "year": 2025 }
    response = requests.get(f"{BASE_URL}/report", params=params)
    assert response.status_code == 400
    assert "error" in response.json()

def test_get_about_info():
    response = requests.get(f"{BASE_URL}/about")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    for member in data:
        assert "first_name" in member and "last_name" in member