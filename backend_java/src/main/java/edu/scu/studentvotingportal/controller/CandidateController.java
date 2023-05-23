package edu.scu.studentvotingportal.controller;

import edu.scu.studentvotingportal.dto.CandidateParams;
import edu.scu.studentvotingportal.dto.CandidateResp;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.exception.DataNotExistsException;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.service.CandidateService;
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
@RequestMapping("/candidates/")
public class CandidateController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    CandidateService candidateService;


    @GetMapping
    public ResponseEntity<Resp> getAllCandidates() {
        List<CandidateResp> data = candidateService.getAllCandidateInfo();
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @GetMapping("{candidateId}/")
    public ResponseEntity<Resp> getCandidate(@PathVariable String candidateId) {
        CandidateResp data = candidateService.getCandidateInfoById(Long.valueOf(candidateId));
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @PostMapping
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> createCandidate(Authentication authentication, @RequestBody CandidateParams params) {
        Long userId = Long.valueOf(authentication.getName());
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new DataNotExistsException("User not found");
        }
        CandidateResp data = candidateService.createCandidate(params, user);
        return new ResponseEntity<>(Resp.Success(HttpStatus.CREATED.value(), data), HttpStatus.CREATED);
    }

    @RequestMapping(value = "{candidateId}/", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> modifyCandidate(Authentication authentication, @RequestBody CandidateParams params,
                                                HttpServletRequest request,
                                                @PathVariable String candidateId) {
        Long userId = Long.valueOf(authentication.getName());

        CandidateResp data = candidateService.modifyCandidate(userId, Long.valueOf(candidateId), params,
            request.getMethod().equals("PATCH"));
        return new ResponseEntity<>(Resp.Success(HttpStatus.CREATED.value(), data), HttpStatus.CREATED);
    }

    @DeleteMapping("{candidateId}/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> deleteCandidate(Authentication authentication, @PathVariable String candidateId) {
        Long userId = Long.valueOf(authentication.getName());
        candidateService.deleteCandidate(userId, Long.valueOf(candidateId));
        return new ResponseEntity<>(Resp.Success(HttpStatus.NO_CONTENT.value()), HttpStatus.NO_CONTENT);
    }
}
