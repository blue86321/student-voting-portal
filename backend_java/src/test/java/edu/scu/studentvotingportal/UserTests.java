package edu.scu.studentvotingportal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.scu.studentvotingportal.dto.UserLoginParams;
import edu.scu.studentvotingportal.dto.UserParams;
import edu.scu.studentvotingportal.entity.University;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.repository.UniversityRepository;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.service.ElectionService;
import edu.scu.studentvotingportal.service.UserService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
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
import java.util.Date;
import java.util.Optional;
import java.util.stream.Stream;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class UserTests {

    static final String userPassword = "test_1234";
    @Autowired
    MockMvc mvc;
    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UniversityRepository universityRepository;
    @Autowired
    ElectionService electionService;
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    ObjectMapper mapper = new ObjectMapper();
    University university = University.builder().name("Santa Clara University").build();
    University anotherUniversity = University.builder().name("San Jose State University").build();
    Users registeredUser;
    Users.UsersBuilder usersBuilder = Users.builder()
        .email("user@scu.edu")
        .password(passwordEncoder.encode(userPassword))
        .university(this.university)
        .dob(new SimpleDateFormat("yyyy-MM-dd").parse("1990-01-01"))
        .staff(false).superuser(false);
    Users user = usersBuilder.build();
    Users admin = usersBuilder.email("admin@scu.edu").staff(true).build();
    Users superuser = usersBuilder.email("superuser@scu.edu").staff(true).superuser(true).build();
    Users userAnotherUniv = usersBuilder.email("user@sjsu.edu").university(anotherUniversity).build();
    String tokenUser;

    UserTests() throws ParseException {
    }

    @BeforeAll
    public void setup() {
        // Create university
        universityRepository.save(university);
        universityRepository.save(anotherUniversity);
        // Create user
        userRepository.save(user);
        userRepository.save(userAnotherUniv);
        userRepository.save(admin);
        userRepository.save(superuser);
    }

    @AfterAll
    public void tearDown() {
        // tear down user
        userRepository.delete(user);
        userRepository.delete(userAnotherUniv);
        userRepository.delete(admin);
        userRepository.delete(superuser);

        // tear down university
        universityRepository.delete(university);
        universityRepository.delete(anotherUniversity);
    }

    @ParameterizedTest
    @ValueSource(booleans = {true})
    public void testRegister(boolean delete) throws Exception {
        UserParams userParams = UserParams.builder()
            .email("another@scu.edu")
            .password(userPassword)
            .passwordConfirm(userPassword)
            .universityId(university.getId())
            .dob(new SimpleDateFormat("yyyy-MM-dd").parse("1990-01-01"))
            .build();
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post("/users/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userParams)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.token.access").exists())
            .andReturn();
        JsonNode jsonNode = new ObjectMapper().readTree(mvcResult.getResponse().getContentAsString());
        tokenUser = jsonNode.get("data").get("token").get("access").textValue();

        Optional<Users> user = userRepository.findFirstByEmail("another@scu.edu");
        if (user.isPresent()) {
            registeredUser = user.get();
            if (delete) {
                userRepository.delete(user.get());
            }
        }
    }

    @ParameterizedTest
    @MethodSource("getLoginUserEmails")
    public void testLogin(String email) throws Exception {
        // Perform login request
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
        tokenUser = jsonNode.get("data").get("token").get("access").textValue();
    }

    private Stream<String> getLoginUserEmails() {
        return Stream.of(user.getEmail(), admin.getEmail());
    }

    @Test
    public void testLogout() throws Exception {
        mvc.perform(
                MockMvcRequestBuilders.delete("/authentication/")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());

        testLogin(user.getEmail());
        mvc.perform(
                MockMvcRequestBuilders.delete("/authentication/")
                    .header("Authorization", "Bearer " + tokenUser)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());
    }


    @Nested
    class GetUserTestCases {
        @Test
        public void testGetMe() throws Exception {
            testRegister(false);
            mvc.perform(
                    MockMvcRequestBuilders.get("/me/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
            userRepository.deleteById(registeredUser.getId());
        }

        @Test
        public void testGetUserByOwner() throws Exception {
            testLogin(user.getEmail());
            mvc.perform(
                    MockMvcRequestBuilders.get("/users/" + user.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
                .andExpect(status().isOk());
        }

        @Test
        public void testGetUserByOther() throws Exception {
            testLogin(user.getEmail());
            mvc.perform(
                    MockMvcRequestBuilders.get("/users/" + admin.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void testGetUserByAdminDiffUniversity() throws Exception {
            testLogin(admin.getEmail());
            mvc.perform(
                    MockMvcRequestBuilders.get("/users/" + userAnotherUniv.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void testGetUserByAdmin() throws Exception {
            testLogin(admin.getEmail());
            mvc.perform(
                    MockMvcRequestBuilders.get("/users/" + user.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
        }

        @Test
        public void testGetAllUsersNoLogin() throws Exception {
            mvc.perform(
                    MockMvcRequestBuilders.get("/users/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void testGetAllUsersByUser() throws Exception {
            testLogin(user.getEmail());
            mvc.perform(
                    MockMvcRequestBuilders.get("/users/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void testGetAllUsersByAdmin() throws Exception {
            // admin (contains same university)
            testLogin(admin.getEmail());
            mvc.perform(
                    MockMvcRequestBuilders.get("/users/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data[*].university.id", not(hasItem(anotherUniversity.getId().intValue()))))
                .andExpect(status().isOk())
                .andReturn();
        }

        @Test
        public void testGetAllUsersBySuperuser() throws Exception {
            // superuser (all)
            testLogin(superuser.getEmail());
            mvc.perform(
                    MockMvcRequestBuilders.get("/users/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data[*].university.id", hasItem(anotherUniversity.getId().intValue())))
                .andExpect(status().isOk())
                .andReturn();
        }
    }

    @Nested
    class DeleteUserTestCases {
        @Test
        public void testDeleteNoLogin() throws Exception {
            testRegister(false);
            // no login
            mvc.perform(
                    MockMvcRequestBuilders.delete("/users/" + registeredUser.getId() + "/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
            userRepository.deleteById(registeredUser.getId());
        }

        @Test
        public void testDeleteByOwner() throws Exception {
            testRegister(false);
            mvc.perform(
                    MockMvcRequestBuilders.delete("/users/" + registeredUser.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
        }

        @Test
        public void testDeleteByAdmin() throws Exception {
            testRegister(false);
            testLogin(admin.getEmail());
            System.out.println(tokenUser);
            mvc.perform(
                    MockMvcRequestBuilders.delete("/users/" + registeredUser.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
        }

        @Test
        public void testDeleteMe() throws Exception {
            testRegister(false);
            mvc.perform(
                    MockMvcRequestBuilders.delete("/me/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
        }
    }


    @Nested
    class UpdateUserTestCases {
        Date newDob = new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01");
        String formatDob = new SimpleDateFormat("yyyy-MM-dd").format(newDob);
        UserParams updatedUserParams = UserParams.builder()
            .email(user.getEmail())
            .universityId(user.getUniversity().getId())
            .dob(newDob)
            .build();

        UpdateUserTestCases() throws ParseException {
        }

        @Test
        public void testPatchMe() throws Exception {
            testLogin(user.getEmail());

            mvc.perform(
                    MockMvcRequestBuilders.patch("/me/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .content(mapper.writeValueAsString(updatedUserParams))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.dob").value(formatDob));
        }

        @Test
        public void testPatchUserByOwner() throws Exception {
            testLogin(user.getEmail());
            Date newDob = new SimpleDateFormat("yyyy-MM-dd").parse("2002-01-01");
            String formatDob = new SimpleDateFormat("yyyy-MM-dd").format(newDob);
            UserParams userParams = updatedUserParams.toBuilder()
                .dob(newDob)
                .build();
            mvc.perform(
                    MockMvcRequestBuilders.patch("/users/" + user.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .content(mapper.writeValueAsString(userParams))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.dob").value(formatDob));
        }

        @Test
        public void testPatchUserByOther() throws Exception {
            testLogin(user.getEmail());
            mvc.perform(
                    MockMvcRequestBuilders.patch("/users/" + admin.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .content(mapper.writeValueAsString(updatedUserParams))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void testPatchUserByAdminDiffUniversity() throws Exception {
            testLogin(admin.getEmail());
            mvc.perform(
                    MockMvcRequestBuilders.patch("/users/" + userAnotherUniv.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .content(mapper.writeValueAsString(updatedUserParams))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void testPatchUserByAdmin() throws Exception {
            testLogin(admin.getEmail());
            Date newDob = new SimpleDateFormat("yyyy-MM-dd").parse("1988-01-01");
            String formatDob = new SimpleDateFormat("yyyy-MM-dd").format(newDob);
            UserParams userParams = updatedUserParams.toBuilder()
                .dob(newDob)
                .build();
            mvc.perform(
                    MockMvcRequestBuilders.patch("/users/" + user.getId() + "/")
                        .header("Authorization", "Bearer " + tokenUser)
                        .content(mapper.writeValueAsString(userParams))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.dob").value(formatDob));
        }
    }
}
