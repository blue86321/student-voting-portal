package edu.scu.studentvotingportal.controller;

import edu.scu.studentvotingportal.dto.UserLoginResp;
import edu.scu.studentvotingportal.dto.UserParams;
import edu.scu.studentvotingportal.dto.UserResp;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.service.UserService;
import edu.scu.studentvotingportal.utils.Resp;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/users/")
    public ResponseEntity<Resp> register(@RequestBody UserParams userParams) {
        UserLoginResp data = userService.register(userParams);
        return new ResponseEntity<>(Resp.Success(HttpStatus.CREATED.value(), data), HttpStatus.CREATED);
    }

    @GetMapping("/users/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> getAllUsers(Authentication authentication) {
        Long sourceUserId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), userService.getUsers(sourceUserId)));
    }

    @GetMapping("/users/{userId}/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> getUser(Authentication authentication, @PathVariable String userId) {
        Long sourceUserId = Long.valueOf(authentication.getName());
        UserResp data = userService.getUserInfo(sourceUserId, Long.valueOf(userId));
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @PatchMapping(value = "/users/{userId}/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> updateUser(Authentication authentication,
                                           @PathVariable String userId,
                                           @RequestBody UserParams userParams) {
        Long sourceUserId = Long.valueOf(authentication.getName());
        Long targetUserId = Long.valueOf(userId);
        UserResp data = userService.modifyUserInfo(sourceUserId, targetUserId, userParams, true);
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @DeleteMapping("/users/{userId}/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> deleteUser(Authentication authentication, @PathVariable String userId) {
        Long sourceUserId = Long.valueOf(authentication.getName());
        Long targetUserId = Long.valueOf(userId);
        userService.deleteUser(sourceUserId, targetUserId);
        return new ResponseEntity<>(Resp.Success(HttpStatus.NO_CONTENT.value()), HttpStatus.NO_CONTENT);
    }

    @GetMapping("/me/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> getMe(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        UserResp data = userService.getUserInfo(userId, userId);
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @PatchMapping(value = "/me/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> updateMe(Authentication authentication, @RequestBody UserParams userParams) {
        Long userId = Long.valueOf(authentication.getName());
        UserResp data = userService.modifyUserInfo(userId, userId, userParams, true);
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @DeleteMapping("/me/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> deleteMe(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        userService.deleteUser(userId, userId);
        return new ResponseEntity<>(Resp.Success(HttpStatus.NO_CONTENT.value()), HttpStatus.NO_CONTENT);
    }
}
