import org.junit.jupiter.api.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for undocumented /projects API behaviors and edge cases.
 * ECSE 429 - Software Validation Term Project (Part A)
 * Author: David Vo (261170038)
 * Date: 02/02/2026
 */
@TestMethodOrder(MethodOrderer.Random.class)
public class ProjectsUndocumentedTest {

    private static final String BASE_URL = "http://localhost:4567";
    private static HttpClient client;

    @BeforeAll
    static void checkServiceRunning() throws Exception {
        client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode(), "Service is not running.");
    }

    @BeforeEach
    void cleanupBeforeEach() throws Exception {
        deleteAll("/todos");
        deleteAll("/categories");
        deleteAll("/projects");
    }

    @AfterEach
    void cleanupAfterEach() throws Exception {
        deleteAll("/todos");
        deleteAll("/categories");
        deleteAll("/projects");
    }

    // ---------- Helpers ----------

    private static String parseFirstIdFromBody(String body) {
        String[] parts = body.split("\"id\":");
        if (parts.length < 2) return null;

        String idPart = parts[1].trim();
        int endIndex = idPart.length();
        for (int j = 0; j < idPart.length(); j++) {
            char c = idPart.charAt(j);
            if (c == ',' || c == '}' || c == ']' || Character.isWhitespace(c)) {
                endIndex = j;
                break;
            }
        }

        String id = idPart.substring(0, endIndex).trim();
        if (id.startsWith("\"") && id.endsWith("\"") && id.length() >= 2) {
            id = id.substring(1, id.length() - 1);
        }
        return id;
    }

    private static void deleteAll(String resourcePath) throws Exception {
        HttpRequest get = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + resourcePath))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(get, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 404) return;

        String body = response.body();
        String[] parts = body.split("\"id\":");
        for (int i = 1; i < parts.length; i++) {
            String idPart = parts[i].trim();

            int endIndex = idPart.length();
            for (int j = 0; j < idPart.length(); j++) {
                char c = idPart.charAt(j);
                if (c == ',' || c == '}' || c == ']' || Character.isWhitespace(c)) {
                    endIndex = j;
                    break;
                }
            }

            String id = idPart.substring(0, endIndex).trim();
            if (id.startsWith("\"") && id.endsWith("\"") && id.length() >= 2) {
                id = id.substring(1, id.length() - 1);
            }

            HttpRequest delete = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL + resourcePath + "/" + id))
                    .DELETE()
                    .build();

            client.send(delete, HttpResponse.BodyHandlers.ofString());
        }
    }

    private static String createProject(String title) throws Exception {
        String json = "{\"title\":\"" + title + "\"}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(201, response.statusCode());
        String id = parseFirstIdFromBody(response.body());
        assertNotNull(id, "Expected created project to include an id.");
        return id;
    }

    private static String createTodo(String title) throws Exception {
        String json = "{\"title\":\"" + title + "\"}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/todos"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(201, response.statusCode());
        return parseFirstIdFromBody(response.body());
    }

    private static String createCategory(String title) throws Exception {
        String json = "{\"title\":\"" + title + "\"}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/categories"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(201, response.statusCode());
        return parseFirstIdFromBody(response.body());
    }

    // ---------- Tests for Undocumented Behavior ----------

    @Test
    void postingJsonWithXmlHeader_stillWorks() throws Exception {
        // API ignores Content-Type header and parses based on content
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/xml")
                .POST(HttpRequest.BodyPublishers.ofString("{\"title\":\"confused\"}"))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(201, response.statusCode());
        assertTrue(response.body().contains("confused"));
    }

    @Test
    void xmlBodyWithJsonHeader_fails() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("<project><title>bad</title></project>"))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(400, response.statusCode());
    }

    @Test
    void postWithoutContentType_acceptsJson() throws Exception {
        // Java HttpClient without Content-Type header defaults to JSON parsing
        // (different from curl which sends application/x-www-form-urlencoded)
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .POST(HttpRequest.BodyPublishers.ofString("{\"title\":\"nocontenttype\"}"))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        // API accepts the request when no Content-Type is specified via HttpClient
        assertEquals(201, response.statusCode());
    }

    @Test
    void patchMethod_returns405() throws Exception {
        String projectId = createProject("patch-test");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId))
                .method("PATCH", HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(405, response.statusCode());
    }

    @Test
    void traceMethod_returns404() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .method("TRACE", HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(404, response.statusCode());
        // Returns HTML page, not JSON
        assertTrue(response.body().contains("html") || response.body().contains("Not found"));
    }

    // ---------- Tests for Relationship Endpoints ----------

    @Test
    void getProjectTasks_emptyList_returns200() throws Exception {
        String projectId = createProject("tasks-test");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("todos"));
    }

    @Test
    void linkTodoToProject_returns201() throws Exception {
        String projectId = createProject("link-test");
        String todoId = createTodo("test todo");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"id\":\"" + todoId + "\"}"))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertTrue(response.statusCode() == 201 || response.statusCode() == 200);
    }

    @Test
    void linkTodoToProject_thenGet_showsLinkedTodo() throws Exception {
        String projectId = createProject("link-verify");
        String todoId = createTodo("linked todo");

        // Link the todo
        HttpRequest linkReq = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"id\":\"" + todoId + "\"}"))
                .build();
        client.send(linkReq, HttpResponse.BodyHandlers.ofString());

        // Get tasks
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("linked todo"));
    }

    @Test
    void unlinkTodoFromProject_returns200() throws Exception {
        String projectId = createProject("unlink-test");
        String todoId = createTodo("to unlink");

        // Link first
        HttpRequest linkReq = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"id\":\"" + todoId + "\"}"))
                .build();
        client.send(linkReq, HttpResponse.BodyHandlers.ofString());

        // Unlink
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks/" + todoId))
                .DELETE()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
    }

    @Test
    void getProjectCategories_emptyList_returns200() throws Exception {
        String projectId = createProject("categories-test");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/categories"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("categories"));
    }

    @Test
    void linkCategoryToProject_works() throws Exception {
        String projectId = createProject("cat-link");
        String categoryId = createCategory("test category");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/categories"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"id\":\"" + categoryId + "\"}"))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertTrue(response.statusCode() == 201 || response.statusCode() == 200);
    }

    @Test
    void linkNonExistentTodo_returns404() throws Exception {
        String projectId = createProject("bad-link");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"id\":\"99999\"}"))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(404, response.statusCode());
    }

    @Test
    void getTasksForNonExistentProject_returns200WithWrongKey() throws Exception {
        // BUG: API returns 200 with {"projects":[]} instead of 404 or {"todos":[]}
        // for non-existent project's tasks - wrong response key!
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/99999/tasks"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        // Note: Returns "projects" key instead of "todos" - this is a bug
        assertTrue(response.body().contains("projects"));
    }

    @Test
    void deleteNonExistentRelationship_returns404() throws Exception {
        String projectId = createProject("delete-rel");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks/99999"))
                .DELETE()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(404, response.statusCode());
    }

    @Test
    void headRequest_forRelationships_works() throws Exception {
        String projectId = createProject("head-test");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks"))
                .method("HEAD", HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().isEmpty()); // HEAD should return no body
    }

    @Test
    void deletingProject_doesNotDeleteLinkedTodos() throws Exception {
        String projectId = createProject("side-effect");
        String todoId = createTodo("should survive");

        // Link todo
        HttpRequest linkReq = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId + "/tasks"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"id\":\"" + todoId + "\"}"))
                .build();
        client.send(linkReq, HttpResponse.BodyHandlers.ofString());

        // Delete project
        HttpRequest deleteReq = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId))
                .DELETE()
                .build();
        client.send(deleteReq, HttpResponse.BodyHandlers.ofString());

        // Verify todo still exists
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/todos/" + todoId))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("should survive"));
    }
}
