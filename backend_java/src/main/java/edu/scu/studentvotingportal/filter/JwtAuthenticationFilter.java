package edu.scu.studentvotingportal.filter;

import edu.scu.studentvotingportal.utils.LoginUser;
import edu.scu.studentvotingportal.handler.CustomAuthenticationEntryPoint;
import edu.scu.studentvotingportal.service.serviceImpl.JwtUserDetailsService;
import edu.scu.studentvotingportal.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final String AUTH_HEADER_KEY = "Authorization";
    private static final String AUTH_HEADER_VALUE_PREFIX = "Bearer ";
    final
    JwtUserDetailsService jwtUserDetailsService;
    @Autowired
    CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Autowired
    JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUserDetailsService jwtUserDetailsService) {
        this.jwtUserDetailsService = jwtUserDetailsService;
    }

    private String getBearerToken(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTH_HEADER_KEY);
        if (authHeader != null && authHeader.startsWith(AUTH_HEADER_VALUE_PREFIX)) {
            return authHeader.substring(AUTH_HEADER_VALUE_PREFIX.length());
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // 1.Get jwt token
            String token = getBearerToken(request);
            // no token, directly pass down
            if (!StringUtils.hasText(token)) {
                filterChain.doFilter(request, response);
                return;
            }
            // 2.Parse jwt token
            String userId = jwtUtil.getUserId(token);
            // 3.Get user info
            LoginUser loginUser = (LoginUser) jwtUserDetailsService.loadUserById(userId);
            // 4.Store to SecurityContextHolder
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                loginUser.getUsers().getId(),
                loginUser.getPassword(),
                // make sure the constructor call **setAuthenticated(true)**
                loginUser.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            filterChain.doFilter(request, response);
        } catch (AuthenticationException ex) {
            SecurityContextHolder.clearContext();
            customAuthenticationEntryPoint.commence(request, response, ex);
        }
    }
}
