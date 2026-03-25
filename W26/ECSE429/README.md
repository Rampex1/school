# 📘 Todo Manager API — Exploratory & Unit Testing

## 📌 Repository Goal

This repository contains the deliverables for exploratory and unit testing of the **Todo Manager REST API**. It documents discovered capabilities and undocumented behaviors, provides reproducible test scripts, and includes a standalone JUnit test suite to verify both core functionality and robustness. The work primarily focuses on the `/todos` and `/projects` endpoints.

---

## 📂 Repository Structure
```
.
├── P1/
│   └── scripts/
│   └── tests/
│   └── session-notes/
│   └── report/
│
├── P2/
│
└── P3/
```

---

## ▶ Running the System Under Test

Start the API server before testing:
```bash
java -jar runTodoManagerRestAPI-1.5.3.jar
```

The service will be available at: **http://localhost:4567**

---

## ▶ Running Exploratory Scripts
```bash
cd scripts
chmod +x session1_todos_exploration.sh
./session1_todos_exploration.sh
```

This script demonstrates:
- `/todos` and `/projects` relationship endpoints
- undocumented behaviors
- protocol robustness issues

---

## ▶ Running Unit Tests (Standalone)
```bash
cd tests
javac -cp junit.jar *.java
java -jar junit.jar --class-path . --scan-class-path
```

**To verify test validity**, stop the server and rerun the tests — they should fail.

---

## 🧪 Testing Scope

- Core `/todos` CRUD functionality
- Extended `/todos` relationship endpoints
- Undocumented and robustness behaviors
- Error handling and protocol validation

---

## 📄 Notes

- Unit tests are standalone (no Maven/Gradle).
- Tests communicate directly with the live REST API.
- Exploratory scripts reproduce session findings.

---
