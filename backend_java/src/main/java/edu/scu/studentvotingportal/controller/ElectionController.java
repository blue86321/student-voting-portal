package edu.scu.studentvotingportal.controller;

import edu.scu.studentvotingportal.dto.ElectionParams;
import edu.scu.studentvotingportal.dto.ElectionResp;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.service.ElectionService;
import edu.scu.studentvotingportal.utils.Resp;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/elections/")
public class ElectionController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ElectionService electionService;

    @GetMapping
    public ResponseEntity<Resp> getAllElections() {
        List<ElectionResp> data = electionService.getAllElectionInfo();
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @GetMapping("{electionId}/")
    public ResponseEntity<Resp> getElection(@PathVariable String electionId) {
        ElectionResp data = electionService.getElectionInfoById(Long.valueOf(electionId));
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @PostMapping
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> createElection(Authentication authentication, @RequestBody ElectionParams params) {
        Long userId = Long.valueOf(authentication.getName());
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return new ResponseEntity<>(Resp.Fail("User not found"), HttpStatus.BAD_REQUEST);
        }
        ElectionResp data = electionService.createElection(params, user);
        return new ResponseEntity<>(Resp.Success(HttpStatus.CREATED.value(), data), HttpStatus.CREATED);
    }

    @RequestMapping(value = "{electionId}/", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> modifyElection(Authentication authentication, @RequestBody ElectionParams params,
                                               HttpServletRequest request,
                                               @PathVariable String electionId) {
        Long userId = Long.valueOf(authentication.getName());

        ElectionResp data = electionService.modifyElection(userId, Long.valueOf(electionId), params,
            request.getMethod().equals("PATCH"));
        return new ResponseEntity<>(Resp.Success(HttpStatus.CREATED.value(), data), HttpStatus.CREATED);
    }

    @DeleteMapping("{electionId}/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> deleteElection(Authentication authentication, @PathVariable String electionId) {
        Long userId = Long.valueOf(authentication.getName());
        electionService.deleteElection(userId, Long.valueOf(electionId));
        return new ResponseEntity<>(Resp.Success(HttpStatus.NO_CONTENT.value()), HttpStatus.NO_CONTENT);
    }
}
