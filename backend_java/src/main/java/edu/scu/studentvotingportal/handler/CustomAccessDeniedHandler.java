package edu.scu.studentvotingportal.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.scu.studentvotingportal.utils.Resp;
import edu.scu.studentvotingportal.utils.WebUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        Resp resp = Resp.Fail(HttpStatus.FORBIDDEN.value(), accessDeniedException.getMessage());
        String json = new ObjectMapper().writeValueAsString(resp);
        WebUtil.renderResponseString(HttpServletResponse.SC_FORBIDDEN, response, json);
    }
}
