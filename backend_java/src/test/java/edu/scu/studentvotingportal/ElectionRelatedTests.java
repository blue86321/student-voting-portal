package edu.scu.studentvotingportal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import edu.scu.studentvotingportal.dto.*;
import edu.scu.studentvotingportal.entity.*;
import edu.scu.studentvotingportal.repository.*;
import edu.scu.studentvotingportal.service.ElectionService;
import edu.scu.studentvotingportal.service.UserService;
import org.junit.jupiter.api.*;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ElectionRelatedTests {
    static final String userPassword = "test_1234";
    @Autowired
    MockMvc mvc;
    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ElectionRepository electionRepository;
    @Autowired
    PositionRepository positionRepository;
    @Autowired
    CandidateRepository candidateRepository;
    @Autowired
    UniversityRepository universityRepository;
    @Autowired
    VoteRepository voteRepository;
    @Autowired
    ElectionService electionService;
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    ObjectMapper mapper = new ObjectMapper();
    University university = University.builder().name("Santa Clara University").build();
    University anotherUniversity = University.builder().name("San Jose State University").build();

    Users.UsersBuilder usersBuilder = Users.builder()
        .email("user@scu.edu")
        .password(passwordEncoder.encode(userPassword))
        .university(university)
        .dob(new SimpleDateFormat("yyyy-MM-dd").parse("1990-01-01"))
        .staff(false).superuser(false);
    Users user = usersBuilder.build();
    Users user1 = usersBuilder.email("user1@scu.edu").build();
    Users user2 = usersBuilder.email("user2@scu.edu").build();
    Users user3 = usersBuilder.email("user3@scu.edu").build();
    Users userAnotherUniv = usersBuilder.email("user@sjsu.edu").university(anotherUniversity).build();
    Users admin = Users.builder()
        .email("admin@scu.edu")
        .password(passwordEncoder.encode(userPassword))
        .university(university)
        .dob(new SimpleDateFormat("yyyy-MM-dd").parse("1990-01-01"))
        .staff(true).superuser(false).build();
    Elections election = Elections.builder()
        .university(university)
        .electionName("SCU club president election")
        .startTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2023-05-20 12:00:00.000000"))
        .endTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2023-06-20 12:00:00.000000"))
        .build();
    Positions position = Positions.builder()
        .election(election)
        .positionName("SCU club president")
        .maxVotesTotal(1)
        .maxVotesPerCandidate(1)
        .build();
    Positions position1 = Positions.builder()
        .election(election)
        .positionName("SCU club vice president")
        .maxVotesTotal(2)
        .maxVotesPerCandidate(1)
        .build();
    Candidates candidate = Candidates.builder()
        .election(election)
        .position(position)
        .candidateName("Allen")
        .build();
    Candidates candidate1 = Candidates.builder()
        .election(election)
        .position(position1)
        .candidateName("Tim")
        .build();
    Candidates candidate2 = Candidates.builder()
        .election(election)
        .position(position1)
        .candidateName("Mark")
        .build();

    ElectionRelatedTests() throws ParseException {
    }


    @BeforeAll
    public void setup() {
        // Create university
        universityRepository.save(university);
        universityRepository.save(anotherUniversity);

        // Create user
        userRepository.save(user);
        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(userAnotherUniv);
        userRepository.save(admin);

        // Create election
        electionRepository.save(election);
        positionRepository.save(position);
        positionRepository.save(position1);
        candidateRepository.save(candidate);
        candidateRepository.save(candidate1);
        candidateRepository.save(candidate2);
    }

    @AfterAll
    public void tearDown() {
        // tear down university
        universityRepository.delete(university);
        universityRepository.delete(anotherUniversity);

        // tear down user
        userRepository.delete(user);
        userRepository.delete(user1);
        userRepository.delete(user2);
        userRepository.delete(user3);
        userRepository.delete(userAnotherUniv);
        userRepository.delete(admin);

        // tear down election
        electionRepository.delete(election);
        positionRepository.delete(position);
        positionRepository.delete(position1);
        candidateRepository.delete(candidate);
        candidateRepository.delete(candidate1);
        candidateRepository.delete(candidate2);
    }

    public String loginHelper(String email) throws Exception {
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
        return jsonNode.get("data").get("token").get("access").textValue();
    }

    @Nested
    class ElectionTestCases {

        ElectionParams newElectionParams = ElectionParams.builder()
            .universityId(university.getId())
            .electionName("Another elections")
            .startTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2023-05-20 12:00:00.000000"))
            .endTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2023-06-20 12:00:00.000000"))
            .build();

        Long newElectionId;

        ElectionTestCases() throws ParseException {
        }

        @Test
        public void getElections() throws Exception {
            mvc.perform(MockMvcRequestBuilders.get("/elections/")
                    .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.msg").value(""))
                .andExpect(jsonPath("$.data", hasSize(1)));
        }

        @Test
        public void postElectionsNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.post("/elections/")
                    .content(mapper.writeValueAsString(newElectionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void postElectionsUser() throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.post("/elections/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newElectionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @ParameterizedTest
        @ValueSource(booleans = {true})
        public void postElectionsAdmin(boolean delete) throws Exception {
            String token = loginHelper(admin.getEmail());
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post("/elections/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newElectionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andReturn();
            JsonNode jsonNode = new ObjectMapper().readTree(mvcResult.getResponse().getContentAsString());
            Long electionId = jsonNode.get("data").get("id").asLong();
            if (delete) {
                electionRepository.deleteById(electionId);
            } else {
                newElectionId = electionId;
            }
        }

        @Test
        public void updateElectionsNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.put("/elections/" + election.getId() + "/")
                    .content(mapper.writeValueAsString(newElectionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

            mvc.perform(MockMvcRequestBuilders.patch("/elections/" + election.getId() + "/")
                    .content(mapper.writeValueAsString(newElectionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void updateElectionsUser() throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.put("/elections/" + election.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newElectionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
            mvc.perform(MockMvcRequestBuilders.patch("/elections/" + election.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newElectionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void updateElectionsAdmin() throws Exception {
            String token = loginHelper(admin.getEmail());

            // PUT
            String newName = "New Election Name";
            Date newEndTime = new Date();
            String formatEndTime = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").format(newEndTime);
            ElectionParams putElectionParams = newElectionParams.toBuilder()
                .electionName(newName)
                .endTime(newEndTime)
                .build();
            mvc.perform(MockMvcRequestBuilders.put("/elections/" + election.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(putElectionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.electionName").value(newName))
                .andExpect(jsonPath("$.data.endTime").value(formatEndTime));

            // PATCH
            ElectionParams patchElectionParams = ElectionParams.builder()
                .electionName(newElectionParams.getElectionName())
                .endTime(election.getEndTime())
                .build();
            String originFormatEndTime = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")
                .format(election.getEndTime());
            mvc.perform(MockMvcRequestBuilders.patch("/elections/" + election.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(patchElectionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.electionName").value(newElectionParams.getElectionName()))
                .andExpect(jsonPath("$.data.endTime").value(originFormatEndTime));
        }

        @Test
        public void deleteElectionsNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.delete("/elections/" + election.getId() + "/")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void deleteElectionsUser() throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.delete("/elections/" + election.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void deleteElectionsAdmin() throws Exception {
            postElectionsAdmin(false);
            String token = loginHelper(admin.getEmail());
            mvc.perform(MockMvcRequestBuilders.delete("/elections/" + newElectionId + "/")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
        }
    }


    @Nested
    class PositionTestCases {
        PositionParams newPositionParams = PositionParams.builder()
            .electionId(election.getId())
            .positionName("SCU club president")
            .maxVotesTotal(1)
            .maxVotesPerCandidate(1)
            .build();

        Long newPositionId;

        @Test
        public void getPositions() throws Exception {
            mvc.perform(MockMvcRequestBuilders.get("/positions/")
                    .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.msg").value(""));
        }

        @Test
        public void postPositionsNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.post("/positions/")
                    .content(mapper.writeValueAsString(newPositionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void postPositionsUser() throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.post("/positions/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newPositionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @ParameterizedTest
        @ValueSource(booleans = {true})
        public void postPositionsAdmin(boolean delete) throws Exception {
            String token = loginHelper(admin.getEmail());
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post("/positions/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newPositionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andReturn();
            JsonNode jsonNode = new ObjectMapper().readTree(mvcResult.getResponse().getContentAsString());
            Long positionId = jsonNode.get("data").get("id").asLong();
            if (delete) {
                positionRepository.deleteById(positionId);
            } else {
                newPositionId = positionId;
            }
        }

        @Test
        public void updatePositionsNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.put("/positions/" + position.getId() + "/")
                    .content(mapper.writeValueAsString(newPositionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
            mvc.perform(MockMvcRequestBuilders.patch("/positions/" + position.getId() + "/")
                    .content(mapper.writeValueAsString(newPositionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void updatePositionsUser() throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.put("/positions/" + position.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newPositionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
            mvc.perform(MockMvcRequestBuilders.patch("/positions/" + position.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newPositionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void updatePositionsAdmin() throws Exception {
            String token = loginHelper(admin.getEmail());

            // PUT
            String newName = "New Position Name";
            PositionParams putPositionParams = newPositionParams.toBuilder()
                .positionName(newName)
                .build();
            mvc.perform(MockMvcRequestBuilders.put("/positions/" + position.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(putPositionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.positionName").value(newName));

            // PATCH
            PositionParams patchPositionParams = PositionParams.builder()
                .positionName(newPositionParams.getPositionName())
                .build();
            mvc.perform(MockMvcRequestBuilders.patch("/positions/" + position.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(patchPositionParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.positionName").value(newPositionParams.getPositionName()));
        }

        @Test
        public void deletePositionsNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.delete("/positions/" + position.getId() + "/")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void deletePositionsUser() throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.delete("/positions/" + position.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void deletePositionsAdmin() throws Exception {
            postPositionsAdmin(false);
            String token = loginHelper(admin.getEmail());
            mvc.perform(MockMvcRequestBuilders.delete("/positions/" + newPositionId + "/")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
        }
    }

    @Nested
    class CandidateTestCases {
        CandidateParams newCandidateParams = CandidateParams.builder()
            .electionId(election.getId())
            .positionId(position.getId())
            .candidateName("SCU club president")
            .candidateDesc("desc")
            .build();

        Long newCandidateId;

        @Test
        public void getCandidates() throws Exception {
            mvc.perform(MockMvcRequestBuilders.get("/candidates/")
                    .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.msg").value(""));
        }

        @Test
        public void postCandidatesNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.post("/candidates/")
                    .content(mapper.writeValueAsString(newCandidateParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void postCandidatesUser() throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.post("/candidates/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newCandidateParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @ParameterizedTest
        @ValueSource(booleans = {true})
        public void postCandidatesAdmin(boolean delete) throws Exception {
            String token = loginHelper(admin.getEmail());
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post("/candidates/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newCandidateParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andReturn();
            JsonNode jsonNode = new ObjectMapper().readTree(mvcResult.getResponse().getContentAsString());
            Long candidateId = jsonNode.get("data").get("id").asLong();
            if (delete) {
                candidateRepository.deleteById(candidateId);
            } else {
                newCandidateId = candidateId;
            }
        }

        @Test
        public void updateCandidatesNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.put("/candidates/" + candidate.getId() + "/")
                    .content(mapper.writeValueAsString(newCandidateParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
            mvc.perform(MockMvcRequestBuilders.patch("/candidates/" + candidate.getId() + "/")
                    .content(mapper.writeValueAsString(newCandidateParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void updateCandidatesUser() throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.put("/candidates/" + candidate.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newCandidateParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
            mvc.perform(MockMvcRequestBuilders.patch("/candidates/" + candidate.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newCandidateParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void updateCandidatesAdmin() throws Exception {
            String token = loginHelper(admin.getEmail());

            // PUT
            String newName = "New Candidate Name";
            CandidateParams putCandidateParams = newCandidateParams.toBuilder()
                .candidateName(newName)
                .build();
            mvc.perform(MockMvcRequestBuilders.put("/candidates/" + candidate.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(putCandidateParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.candidateName").value(newName));

            // PATCH
            CandidateParams patchCandidateParams = CandidateParams.builder()
                .candidateName(newCandidateParams.getCandidateName())
                .build();
            mvc.perform(MockMvcRequestBuilders.patch("/candidates/" + candidate.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(patchCandidateParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.candidateName").value(newCandidateParams.getCandidateName()));
        }

        @Test
        public void deleteCandidatesNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.delete("/candidates/" + candidate.getId() + "/")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void deleteCandidatesUser() throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.delete("/candidates/" + candidate.getId() + "/")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void deleteCandidatesAdmin() throws Exception {
            postCandidatesAdmin(false);
            String token = loginHelper(admin.getEmail());
            mvc.perform(MockMvcRequestBuilders.delete("/candidates/" + newCandidateId + "/")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
        }
    }


    @Nested
    class VoteTestCases {
        VoteParams newVoteParams = VoteParams.builder()
            .electionId(election.getId())
            .votes(
                new ArrayList<>(Arrays.asList(
                    VoteParams.VoteInfo.builder()
                        .positionId(position.getId())
                        .candidates(
                            Collections.singletonList(
                                VoteParams.CandidateInfo.builder()
                                    .candidateId(candidate.getId())
                                    .voteCount(1)
                                    .build()
                            )
                        ).build(),
                    VoteParams.VoteInfo.builder()
                        .positionId(position1.getId())
                        .candidates(
                            new ArrayList<>(Arrays.asList(
                                VoteParams.CandidateInfo.builder()
                                    .candidateId(candidate1.getId())
                                    .voteCount(1)
                                    .build(),
                                VoteParams.CandidateInfo.builder()
                                    .candidateId(candidate2.getId())
                                    .voteCount(1)
                                    .build()
                            ))
                        ).build()
                ))
            ).build();

        @Test
        public void getVotesNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.get("/votes/")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        /**
         * Will be called in {@link edu.scu.studentvotingportal.ElectionRelatedTests.VoteTestCases#postVotesUser()} */
        public void getVotesUser(int resultSize) throws Exception {
            String token = loginHelper(user.getEmail());
            mvc.perform(MockMvcRequestBuilders.get("/votes/")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.msg").value(""))
                .andExpect(jsonPath("$.data", hasSize(resultSize)));
        }

        @Test
        public void getVotesAdmin() throws Exception {
            String token = loginHelper(admin.getEmail());
            mvc.perform(MockMvcRequestBuilders.get("/votes/")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void postVotesNoLogin() throws Exception {
            mvc.perform(MockMvcRequestBuilders.post("/votes/")
                    .content(mapper.writeValueAsString(newVoteParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
        }

        @Test
        public void postVotesUserDiffUniversity() throws Exception {
            String token = loginHelper(userAnotherUniv.getEmail());
            mapper.writeValueAsString(newVoteParams);
            mvc.perform(MockMvcRequestBuilders.post("/votes/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newVoteParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }

        @Test
        public void postVotesUser() throws Exception {
            String token = loginHelper(user.getEmail());

            // validator (exceed `maxVotesPerCandidate`)
            JsonNode jsonNode = new ObjectMapper().readTree(mapper.writeValueAsString(newVoteParams));
            JsonNode voteNode = jsonNode.at("/votes/1/candidates/0");
            ((ObjectNode) voteNode).put("voteCount", 3);
            mvc.perform(MockMvcRequestBuilders.post("/votes/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(jsonNode))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            // valid vote
            mvc.perform(MockMvcRequestBuilders.post("/votes/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newVoteParams))
                    .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
                .andExpect(status().isCreated());

            // vote again
            mvc.perform(MockMvcRequestBuilders.post("/votes/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newVoteParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            getVotesUser(1);
        }

        @Test
        public void postVotesAdmin() throws Exception {
            String token = loginHelper(admin.getEmail());
            mvc.perform(MockMvcRequestBuilders.post("/votes/")
                    .header("Authorization", "Bearer " + token)
                    .content(mapper.writeValueAsString(newVoteParams))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        }
    }
}
