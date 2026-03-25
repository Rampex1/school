#!/bin/bash
# ECSE 429 - Exploratory Testing Session 3
# /projects endpoint - Basic CRUD Operations
# Author: David Vo (261170038)
# Date: 02/02/2026

BASE_URL="http://localhost:4567"

echo "=========================================="
echo "Session 3: Projects API Exploration"
echo "=========================================="

# Test 1: GET all projects
echo -e "\n[TEST 1] GET /projects - Retrieve all projects"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects"

# Test 2: POST create a new project with all fields
echo -e "\n[TEST 2] POST /projects - Create project with all fields"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Project", "description": "A test project", "completed": false, "active": true}'

# Test 3: POST create a project with minimal fields (just title)
echo -e "\n[TEST 3] POST /projects - Create project with just title"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{"title": "Minimal Project"}'

# Test 4: POST create a project with empty body (title not mandatory!)
echo -e "\n[TEST 4] POST /projects - Create project with empty body"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{}'

# Test 5: GET a specific project by ID
echo -e "\n[TEST 5] GET /projects/1 - Retrieve specific project"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects/1"

# Test 6: POST partial update (change active status)
echo -e "\n[TEST 6] POST /projects/1 - Partial update (active field only)"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects/1" \
  -H "Content-Type: application/json" \
  -d '{"active": true}'

# Test 7: PUT update (without title - should work for projects)
echo -e "\n[TEST 7] PUT /projects/1 - Update without title"
curl -s -w "\nHTTP Status: %{http_code}\n" -X PUT "$BASE_URL/projects/1" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Test 8: GET with query parameter filter
echo -e "\n[TEST 8] GET /projects?active=true - Filter by active status"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects?active=true"

# Test 9: HEAD request for headers
echo -e "\n[TEST 9] HEAD /projects - Get headers only"
curl -s -I "$BASE_URL/projects"

# Test 10: DELETE a project
echo -e "\n[TEST 10] DELETE /projects/2 - Delete a project"
# First create one to delete
PROJECT_ID=$(curl -s -X POST "$BASE_URL/projects" -H "Content-Type: application/json" -d '{"title": "To Delete"}' | grep -o '"id":"[0-9]*"' | head -1 | grep -o '[0-9]*')
echo "Created project with ID: $PROJECT_ID"
curl -s -w "\nHTTP Status: %{http_code}\n" -X DELETE "$BASE_URL/projects/$PROJECT_ID"

# Test 11: DELETE same project again (should return 404)
echo -e "\n[TEST 11] DELETE /projects/$PROJECT_ID again - Should return 404"
curl -s -w "\nHTTP Status: %{http_code}\n" -X DELETE "$BASE_URL/projects/$PROJECT_ID"

# Test 12: GET non-existent project
echo -e "\n[TEST 12] GET /projects/9999 - Non-existent project"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects/9999"

# Test 13: POST with unknown field (should fail)
echo -e "\n[TEST 13] POST /projects - Unknown field (should fail)"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "unknown_field": "value"}'

# Test 14: POST with boolean as string (should fail)
echo -e "\n[TEST 14] POST /projects - Boolean as string (should fail)"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "active": "true"}'

# Test 15: GET as XML
echo -e "\n[TEST 15] GET /projects - Accept XML"
curl -s -w "\nHTTP Status: %{http_code}\n" -H "Accept: application/xml" "$BASE_URL/projects"

# Test 16: POST as XML
echo -e "\n[TEST 16] POST /projects - XML body"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/xml" \
  -d '<project><title>XML Project</title></project>'

# Test 17: Malformed JSON
echo -e "\n[TEST 17] POST /projects - Malformed JSON"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d 'not valid json'

echo -e "\n=========================================="
echo "Session 3 Complete"
echo "=========================================="
