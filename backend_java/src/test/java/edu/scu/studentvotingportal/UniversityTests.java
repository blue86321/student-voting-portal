package edu.scu.studentvotingportal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.scu.studentvotingportal.dto.UniversityParams;
import edu.scu.studentvotingportal.dto.UserLoginParams;
import edu.scu.studentvotingportal.entity.University;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.repository.UniversityRepository;
import edu.scu.studentvotingportal.repository.UserRepository;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class UniversityTests {

    static final String userPassword = "test_1234";
    @Autowired
    MockMvc mvc;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UniversityRepository universityRepository;
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    ObjectMapper mapper = new ObjectMapper();
    University university = University.builder().name("Santa Clara University").build();
    Users.UsersBuilder usersBuilder = Users.builder()
        .password(passwordEncoder.encode(userPassword))
        .university(this.university)
        .dob(new SimpleDateFormat("yyyy-MM-dd").parse("1990-01-01"));
    Users admin = usersBuilder.email("admin@scu.edu").staff(true).build();
    Users superuser = usersBuilder.email("superuser@scu.edu").staff(true).superuser(true).build();

    Long newUniversityId;

    UniversityTests() throws ParseException {
    }

    @BeforeAll
    public void setup() {
        // Create university
        universityRepository.save(university);
        // Create user
        userRepository.save(admin);
        userRepository.save(superuser);
    }

    @AfterAll
    public void tearDown() {
        // tear down university
        universityRepository.delete(university);

        // tear down user
        userRepository.delete(admin);
        userRepository.delete(superuser);

    }

    public String loginHelper(String email) throws Exception {
        UserLoginParams userLoginParams = UserLoginParams
            .builder()
            .email(email)
            .password(userPassword)
            .build();
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post("/authentication/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userLoginParams)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.token.access").exists())
            .andReturn();
        JsonNode jsonNode = new ObjectMapper().readTree(mvcResult.getResponse().getContentAsString());
        return jsonNode.get("data").get("token").get("access").textValue();
    }

    @Test
    public void testGetUniversity() throws Exception {
        mvc.perform(
                MockMvcRequestBuilders.get("/university/")
                    .contentType(MediaType.APPLICATION_JSON))
//            .andDo(print())
            .andExpect(status().isOk());

        mvc.perform(
                MockMvcRequestBuilders.get("/university/" + university.getId() + "/")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    public void testPostExistUniversityByAdmin() throws Exception {
        String token = loginHelper(admin.getEmail());
        UniversityParams universityParams = new UniversityParams();
        universityParams.setName("Another University");
        mvc.perform(
                MockMvcRequestBuilders.post("/university/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(universityParams))
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    public void testPostExistUniversityBySuperuser() throws Exception {
        String token = loginHelper(superuser.getEmail());
        UniversityParams universityParams = new UniversityParams();
        universityParams.setName(university.getName());
        mvc.perform(
                MockMvcRequestBuilders.post("/university/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(universityParams))
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @ParameterizedTest
    @ValueSource(booleans = {true})
    public void testPostUniversityBySuperuser(boolean delete) throws Exception {
        String token = loginHelper(superuser.getEmail());
        UniversityParams universityParams = new UniversityParams();
        universityParams.setName("Another University");
        MvcResult mvcResult = mvc.perform(
                MockMvcRequestBuilders.post("/university/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(universityParams))
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isCreated())
            .andReturn();

        JsonNode jsonNode = mapper.readTree(mvcResult.getResponse().getContentAsString());
        newUniversityId = jsonNode.get("data").get("id").asLong();
        if (delete) {
            universityRepository.deleteById(newUniversityId);
        }
    }

    @Test
    public void testDeleteUniversityBySuperuser() throws Exception {
        String token = loginHelper(superuser.getEmail());

        testPostUniversityBySuperuser(false);
        mvc.perform(
                MockMvcRequestBuilders.delete("/university/" + newUniversityId + "/")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());
    }
}
