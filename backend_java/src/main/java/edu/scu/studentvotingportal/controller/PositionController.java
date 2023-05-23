package edu.scu.studentvotingportal.controller;

import edu.scu.studentvotingportal.dto.PositionParams;
import edu.scu.studentvotingportal.dto.PositionResp;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.service.PositionService;
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
@RequestMapping("/positions/")
public class PositionController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PositionService positionService;


    @GetMapping
    public ResponseEntity<Resp> getAllPositions() {
        List<PositionResp> data = positionService.getAllPositionInfo();
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @GetMapping("{positionId}/")
    public ResponseEntity<Resp> getPosition(@PathVariable String positionId) {
        PositionResp data = positionService.getPositionInfoById(Long.valueOf(positionId));
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), data));
    }

    @PostMapping
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> createPosition(Authentication authentication, @RequestBody PositionParams params) {
        Long userId = Long.valueOf(authentication.getName());
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return new ResponseEntity<>(Resp.Fail("User not found"), HttpStatus.BAD_REQUEST);
        }
        PositionResp data = positionService.createPosition(params, user);
        return new ResponseEntity<>(Resp.Success(HttpStatus.CREATED.value(), data), HttpStatus.CREATED);
    }


    @RequestMapping(value = "{positionId}/", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> modifyPosition(Authentication authentication, @RequestBody PositionParams params,
                                               HttpServletRequest request,
                                               @PathVariable String positionId) {
        Long userId = Long.valueOf(authentication.getName());

        PositionResp data = positionService.modifyPosition(userId, Long.valueOf(positionId), params,
            request.getMethod().equals("PATCH"));
        return new ResponseEntity<>(Resp.Success(HttpStatus.CREATED.value(), data), HttpStatus.CREATED);

    }

    @DeleteMapping("{positionId}/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> deletePosition(Authentication authentication, @PathVariable String positionId) {
        Long userId = Long.valueOf(authentication.getName());
        positionService.deletePosition(userId, Long.valueOf(positionId));
        return new ResponseEntity<>(Resp.Success(HttpStatus.NO_CONTENT.value()), HttpStatus.NO_CONTENT);
    }
}
