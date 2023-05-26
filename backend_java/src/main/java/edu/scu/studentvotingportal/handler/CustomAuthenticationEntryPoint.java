package edu.scu.studentvotingportal.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.scu.studentvotingportal.utils.Resp;
import edu.scu.studentvotingportal.utils.WebUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        Resp resp = Resp.Fail(HttpStatus.UNAUTHORIZED.value(), authException.getMessage());
        String json = new ObjectMapper().writeValueAsString(resp);
        WebUtil.renderResponseString(HttpServletResponse.SC_UNAUTHORIZED, response, json);
    }
}
