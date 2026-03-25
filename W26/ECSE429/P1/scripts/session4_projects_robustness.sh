#!/bin/bash
# ECSE 429 - Exploratory Testing Session 4
# /projects endpoint - Relationships and Edge Cases
# Author: David Vo (261170038)
# Date: 02/02/2026

BASE_URL="http://localhost:4567"

echo "=========================================="
echo "Session 4: Projects API Relationships & Edge Cases"
echo "=========================================="

# Setup: Create a project and a todo for relationship testing
echo -e "\n[SETUP] Creating test project and todo..."
PROJECT_RESP=$(curl -s -X POST "$BASE_URL/projects" -H "Content-Type: application/json" -d '{"title": "Test Project for Relationships"}')
PROJECT_ID=$(echo $PROJECT_RESP | grep -o '"id":"[0-9]*"' | head -1 | grep -o '[0-9]*')
echo "Created project with ID: $PROJECT_ID"

TODO_RESP=$(curl -s -X POST "$BASE_URL/todos" -H "Content-Type: application/json" -d '{"title": "Test Todo", "doneStatus": false}')
TODO_ID=$(echo $TODO_RESP | grep -o '"id":"[0-9]*"' | head -1 | grep -o '[0-9]*')
echo "Created todo with ID: $TODO_ID"

# Test 1: GET tasks for a project (initially empty)
echo -e "\n[TEST 1] GET /projects/$PROJECT_ID/tasks - Get tasks (initially empty)"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects/$PROJECT_ID/tasks"

# Test 2: POST link todo to project
echo -e "\n[TEST 2] POST /projects/$PROJECT_ID/tasks - Link todo to project"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects/$PROJECT_ID/tasks" \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"$TODO_ID\"}"

# Test 3: GET tasks again (should show linked todo)
echo -e "\n[TEST 3] GET /projects/$PROJECT_ID/tasks - Get tasks after linking"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects/$PROJECT_ID/tasks"

# Test 4: DELETE task relationship
echo -e "\n[TEST 4] DELETE /projects/$PROJECT_ID/tasks/$TODO_ID - Remove relationship"
curl -s -w "\nHTTP Status: %{http_code}\n" -X DELETE "$BASE_URL/projects/$PROJECT_ID/tasks/$TODO_ID"

# Test 5: Verify relationship removed
echo -e "\n[TEST 5] GET /projects/$PROJECT_ID/tasks - Verify relationship removed"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects/$PROJECT_ID/tasks"

# Test 6: GET categories for project (initially empty)
echo -e "\n[TEST 6] GET /projects/$PROJECT_ID/categories - Get categories"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects/$PROJECT_ID/categories"

# Test 7: Create a category and link it
echo -e "\n[TEST 7] Create category and link to project"
CAT_RESP=$(curl -s -X POST "$BASE_URL/categories" -H "Content-Type: application/json" -d '{"title": "Test Category"}')
CAT_ID=$(echo $CAT_RESP | grep -o '"id":"[0-9]*"' | head -1 | grep -o '[0-9]*')
echo "Created category with ID: $CAT_ID"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects/$PROJECT_ID/categories" \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"$CAT_ID\"}"

# Test 8: GET categories after linking
echo -e "\n[TEST 8] GET /projects/$PROJECT_ID/categories - After linking"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects/$PROJECT_ID/categories"

# Test 9: HEAD request for relationship endpoint
echo -e "\n[TEST 9] HEAD /projects/$PROJECT_ID/tasks - Headers only"
curl -s -I "$BASE_URL/projects/$PROJECT_ID/tasks"

# Test 10: PATCH method (unsupported)
echo -e "\n[TEST 10] PATCH /projects/$PROJECT_ID - Unsupported method"
curl -s -w "\nHTTP Status: %{http_code}\n" -X PATCH "$BASE_URL/projects/$PROJECT_ID" \
  -H "Content-Type: application/json" \
  -d '{"title": "Patched"}'

# Test 11: TRACE method (unsupported)
echo -e "\n[TEST 11] TRACE /projects - Unsupported method"
curl -s -w "\nHTTP Status: %{http_code}\n" -X TRACE "$BASE_URL/projects"

# Test 12: JSON body with XML content-type header
echo -e "\n[TEST 12] POST /projects - JSON body with XML header"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/xml" \
  -d '{"title": "JSON with XML header"}'

# Test 13: XML body with JSON content-type header
echo -e "\n[TEST 13] POST /projects - XML body with JSON header"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '<project><title>XML with JSON header</title></project>'

# Test 14: POST without content-type header
echo -e "\n[TEST 14] POST /projects - No Content-Type header"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects" \
  -d '{"title": "No Content Type"}'

# Test 15: Link non-existent todo to project
echo -e "\n[TEST 15] POST /projects/$PROJECT_ID/tasks - Link non-existent todo"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/projects/$PROJECT_ID/tasks" \
  -H "Content-Type: application/json" \
  -d '{"id": "99999"}'

# Test 16: Relationship operations on non-existent project
echo -e "\n[TEST 16] GET /projects/99999/tasks - Non-existent project"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/projects/99999/tasks"

# Test 17: Delete relationship that doesn't exist
echo -e "\n[TEST 17] DELETE /projects/$PROJECT_ID/tasks/99999 - Non-existent relationship"
curl -s -w "\nHTTP Status: %{http_code}\n" -X DELETE "$BASE_URL/projects/$PROJECT_ID/tasks/99999"

# Cleanup
echo -e "\n[CLEANUP] Deleting test data..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID"
curl -s -X DELETE "$BASE_URL/todos/$TODO_ID"
curl -s -X DELETE "$BASE_URL/categories/$CAT_ID"

echo -e "\n=========================================="
echo "Session 4 Complete"
echo "=========================================="
