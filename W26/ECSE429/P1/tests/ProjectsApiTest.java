import org.junit.jupiter.api.*;
import java.net.http.*;
import java.net.URI;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for documented /projects API endpoints.
 * ECSE 429 - Software Validation Term Project (Part A)
 * Author: David Vo (261170038)
 * Date: 02/02/2026
 */
@TestMethodOrder(MethodOrderer.Random.class)
public class ProjectsApiTest {

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
    void setup() throws Exception {
        deleteAllProjects();
        createProject("Setup Project", "Before each test");
    }

    @AfterEach
    void cleanup() throws Exception {
        deleteAllProjects();
    }

    // ---------- Helper methods ----------

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

    private static String getFirstProjectId() throws Exception {
        HttpRequest get = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(get, HttpResponse.BodyHandlers.ofString());

        return parseFirstIdFromBody(response.body());
    }

    private static String createProject(String title, String desc) throws Exception {
        String json = "{\"title\":\"" + title + "\",\"description\":\"" + desc + "\"}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        return parseFirstIdFromBody(response.body());
    }

    private static void deleteAllProjects() throws Exception {
        HttpRequest get = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(get, HttpResponse.BodyHandlers.ofString());

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
                    .uri(URI.create(BASE_URL + "/projects/" + id))
                    .DELETE()
                    .build();

            client.send(delete, HttpResponse.BodyHandlers.ofString());
        }
    }

    // ---------- Tests for Documented Behavior ----------

    @Test
    void createProject_validJson_returns201() throws Exception {
        String json = "{\"title\":\"JUnit Project\",\"description\":\"Test project\"}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(201, response.statusCode());
        assertTrue(response.body().contains("JUnit Project"));
    }

    @Test
    void createProject_emptyBody_returns201() throws Exception {
        // Unlike todos, projects can be created without title
        String json = "{}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(201, response.statusCode());
        assertTrue(response.body().contains("\"id\""));
    }

    @Test
    void createProject_withBooleanFields_returns201() throws Exception {
        String json = "{\"title\":\"Active Project\",\"active\":true,\"completed\":false}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(201, response.statusCode());
        assertTrue(response.body().contains("\"active\":\"true\""));
    }

    @Test
    void getProjects_returnsList() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("projects"));
    }

    @Test
    void getProjectById_returnsProject() throws Exception {
        String projectId = getFirstProjectId();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("projects"));
    }

    @Test
    void getProjectById_nonExistent_returns404() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/99999"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(404, response.statusCode());
    }

    @Test
    void postUpdate_allowsPartialUpdate() throws Exception {
        String projectId = getFirstProjectId();
        String json = "{\"active\":true}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("\"active\":\"true\""));
    }

    @Test
    void putUpdate_allowsPartialUpdate() throws Exception {
        // Unlike todos, PUT also allows partial update for projects
        String projectId = getFirstProjectId();
        String json = "{\"completed\":true}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId))
                .header("Content-Type", "application/json")
                .PUT(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("\"completed\":\"true\""));
    }

    @Test
    void deleteProject_returns200() throws Exception {
        String projectId = createProject("To Delete", "Will be deleted");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId))
                .DELETE()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
    }

    @Test
    void deleteProjectTwice_returns404() throws Exception {
        String projectId = createProject("Delete Twice", "Test double delete");

        HttpRequest delete1 = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId))
                .DELETE()
                .build();
        client.send(delete1, HttpResponse.BodyHandlers.ofString());

        HttpRequest delete2 = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects/" + projectId))
                .DELETE()
                .build();

        HttpResponse<String> response =
                client.send(delete2, HttpResponse.BodyHandlers.ofString());

        assertEquals(404, response.statusCode());
    }

    @Test
    void getProjects_withFilter_returnsFiltered() throws Exception {
        deleteAllProjects();

        // Create one active and one inactive project
        String json1 = "{\"title\":\"Active\",\"active\":true}";
        String json2 = "{\"title\":\"Inactive\",\"active\":false}";

        HttpRequest req1 = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json1))
                .build();
        client.send(req1, HttpResponse.BodyHandlers.ofString());

        HttpRequest req2 = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json2))
                .build();
        client.send(req2, HttpResponse.BodyHandlers.ofString());

        // Filter by active=true
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects?active=true"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("Active"));
        assertFalse(response.body().contains("Inactive"));
    }

    @Test
    void getProjects_asXml_returnsXml() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Accept", "application/xml")
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().startsWith("<projects>"));
    }

    @Test
    void createProject_withXml_returns201() throws Exception {
        String xml = "<project><title>XML Project</title></project>";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/xml")
                .POST(HttpRequest.BodyPublishers.ofString(xml))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(201, response.statusCode());
        assertTrue(response.body().contains("XML Project"));
    }

    @Test
    void malformedJson_returns400() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"title\":"))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(400, response.statusCode());
    }

    @Test
    void unknownField_returns400() throws Exception {
        String json = "{\"title\":\"Test\",\"unknown_field\":\"value\"}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(400, response.statusCode());
        assertTrue(response.body().contains("Could not find field"));
    }

    @Test
    void booleanAsString_returns400() throws Exception {
        // Boolean fields must be actual booleans, not strings
        String json = "{\"title\":\"Test\",\"active\":\"true\"}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(400, response.statusCode());
        assertTrue(response.body().contains("BOOLEAN"));
    }
}
