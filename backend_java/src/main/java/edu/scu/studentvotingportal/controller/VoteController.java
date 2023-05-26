package edu.scu.studentvotingportal.controller;

import edu.scu.studentvotingportal.dto.VoteParams;
import edu.scu.studentvotingportal.dto.VoteResp;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.exception.DataNotExistsException;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.service.UserService;
import edu.scu.studentvotingportal.service.VoteService;
import edu.scu.studentvotingportal.utils.Resp;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/votes/")
public class VoteController {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VoteService voteService;

    @GetMapping
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> getVote(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        List<VoteResp> data = voteService.getVoteInfo(userId);
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @PostMapping
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> vote(Authentication authentication, @RequestBody VoteParams params) {
        Long userId = Long.valueOf(authentication.getName());
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new DataNotExistsException("User not found");
        }
        List<VoteResp> data = voteService.createVote(params, user);
        return new ResponseEntity<>(Resp.Success(HttpStatus.CREATED.value(), data), HttpStatus.CREATED);
    }
}
