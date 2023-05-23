package edu.scu.studentvotingportal.service.serviceImpl;

import edu.scu.studentvotingportal.dto.UserLoginParams;
import edu.scu.studentvotingportal.dto.UserLoginResp;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.exception.DataNotExistsException;
import edu.scu.studentvotingportal.repository.UniversityRepository;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.utils.LoginUser;
import edu.scu.studentvotingportal.service.AuthService;
import edu.scu.studentvotingportal.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UniversityRepository universityRepository;

    @Override
    public UserLoginResp login(UserLoginParams params) {
        Users user = userRepository
            .findFirstByEmail(params.getEmail())
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        // JWT
        Authentication authToken = new UsernamePasswordAuthenticationToken(params.getEmail(), params.getPassword());
        // go to UserDetailsService to authenticate
        Authentication authenticate = authenticationManager.authenticate(authToken);
        LoginUser principal = (LoginUser) authenticate.getPrincipal();
        String access_token = jwtUtil.createJwt(principal.getUsers().getId().toString());
        // TODO: refresh token
        return new UserLoginResp(user, access_token, "");
    }
}
