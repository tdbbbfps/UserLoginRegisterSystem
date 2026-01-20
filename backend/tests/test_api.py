import sys
import os
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)
from app.core import security

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_user():
    print("Testing login endpoint...")
    response = client.post("/api/auth/token", data={
        "username": "user01",
        "password": "!Abcd1234"
    })
    assert response.status_code == 200
    print("test login user passed.")

def test_update_user():
    print("Testing update user endpoint...")
    response = client.patch("/api/user/1", json={
        "name": "Pytest User",
        "bio": "My bio is updated by pytest!!!"
    })
    assert response.status_code == 200
    print("test update user passed.")

def test_read_user():
    print("Testing read user endpoint...")
    response = client.get("/api/user/1")
    assert response.status_code == 200
    print("test read user passed.")