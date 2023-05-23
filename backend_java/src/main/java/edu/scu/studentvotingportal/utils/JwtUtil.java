package edu.scu.studentvotingportal.utils;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String ISSUER = "student_voting_portal";
    private static final int EXPIRE_SECOND = 1800;

    @Value("${jwt.token.secret}")
    private String secret;

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
            this.secret
                .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .replace("-----END RSA PRIVATE KEY-----", "")
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String createJwt(String userId) {
        Date now = new Date();
        return Jwts.builder()
            .setIssuer(ISSUER)
            .setSubject(userId)
            .setExpiration(new Date(now.getTime() + EXPIRE_SECOND * 1000L))
            .setIssuedAt(now)
            .signWith(this.getSigningKey())
            .compact();
    }

    public String getUserId(String jws) {
        try {
            Claims body =
                Jwts.parserBuilder().setSigningKey(this.getSigningKey()).build().parseClaimsJws(jws).getBody();
            return body.getSubject();
        } catch (ExpiredJwtException e) {
            throw new BadCredentialsException("Token expired");
        } catch (RuntimeException e) {
            throw new BadCredentialsException("Invalid token");
        }
    }
}
