package edu.scu.studentvotingportal.controller;

import edu.scu.studentvotingportal.dto.UserLoginParams;
import edu.scu.studentvotingportal.dto.UserLoginResp;
import edu.scu.studentvotingportal.service.AuthService;
import edu.scu.studentvotingportal.utils.Resp;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authentication/")
public class AuthController {

    @Autowired
    AuthService authService;


    @PostMapping
    public ResponseEntity<Resp> login(@RequestBody UserLoginParams params) {
        UserLoginResp data = authService.login(params);
        return ResponseEntity.ok(Resp.Success(data));
    }

    @DeleteMapping
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> logout(Authentication authentication) {
        // userId
        authentication.getName();
        return new ResponseEntity<>(Resp.Success(HttpStatus.NO_CONTENT.value()), HttpStatus.NO_CONTENT);
    }
}
