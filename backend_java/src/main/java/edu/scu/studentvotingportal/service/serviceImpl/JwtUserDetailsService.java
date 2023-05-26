package edu.scu.studentvotingportal.service.serviceImpl;

import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.utils.LoginUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    /**
     * Authenticate a user with Spring Security when a user try to log in
     *
     * @param username a user's username
     * @return <code>UserDetails</code> for <code>DaoAuthenticationProvider</code> to authenticate user
     * @throws UsernameNotFoundException given username does not exist in database
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users = userRepository
            .findFirstByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        return new LoginUser(users, getAuthorities(users));
    }

    /**
     * Authenticate a user with Spring Security when a user request with token
     *
     * @param userId a user's id in database
     * @return <code>UserDetails</code> for {@link edu.scu.studentvotingportal.filter.JwtAuthenticationFilter} to
     * authenticate user
     */
    public UserDetails loadUserById(String userId) {
        Users users = userRepository
            .findById(Long.valueOf(userId))
            .orElseThrow(() -> new UsernameNotFoundException("UserId not found"));
        return new LoginUser(users, getAuthorities(users));
    }

    private List<? extends GrantedAuthority> getAuthorities(Users users) {
        List<String> authList = new ArrayList<>();
        if (users.isStaff()) authList.add("ADMIN");
        if (users.isSuperuser()) authList.add("SUPERUSER");
        if (authList.isEmpty()) authList.add("USER");
        return authList.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }
}
