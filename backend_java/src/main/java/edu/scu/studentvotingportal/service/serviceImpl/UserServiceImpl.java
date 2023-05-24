package edu.scu.studentvotingportal.service.serviceImpl;

import edu.scu.studentvotingportal.dto.UserLoginParams;
import edu.scu.studentvotingportal.dto.UserLoginResp;
import edu.scu.studentvotingportal.dto.UserParams;
import edu.scu.studentvotingportal.dto.UserResp;
import edu.scu.studentvotingportal.entity.University;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.exception.DataExistsException;
import edu.scu.studentvotingportal.exception.DataNotExistsException;
import edu.scu.studentvotingportal.exception.PermissionException;
import edu.scu.studentvotingportal.exception.ValidationException;
import edu.scu.studentvotingportal.repository.UniversityRepository;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.service.AuthService;
import edu.scu.studentvotingportal.service.UserService;
import edu.scu.studentvotingportal.utils.Permissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    UniversityRepository universityRepository;

    @Autowired
    AuthService authService;

    @Autowired
    PasswordEncoder passwordEncoder;

    private int calculateAge(Date dob) {
        LocalDate currentDate = LocalDate.now();
        LocalDate birthDate = dob.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        Period period = Period.between(birthDate, currentDate);
        return period.getYears();
    }

    private void validate(UserParams params, boolean partial) {
        if (
            !partial && (
                params.getEmail() == null ||
                    params.getPassword() == null ||
                    params.getPasswordConfirm() == null ||
                    params.getDob() == null ||
                    params.getUniversityId() == null
            )
        ) {
            throw new ValidationException("Parameters are not complete");
        }
        // passwords (miss one)
        if ((params.getPassword() == null && params.getPasswordConfirm() != null) ||
            (params.getPassword() != null && params.getPasswordConfirm() == null)) {
            throw new ValidationException("Parameters are not complete");
        }
        // passwords (match)
        if (params.getPassword() != null &&
            params.getPasswordConfirm() != null &&
            !params.getPassword().equals(params.getPasswordConfirm())) {
            throw new ValidationException("Passwords do not match");
        }
        // age
        if (params.getDob() != null && this.calculateAge(params.getDob()) < 18) {
            throw new ValidationException("Age < 18");
        }
    }

    @Override
    public UserLoginResp register(UserParams userParams) {
        // validate
        validate(userParams, false);
        // email unique
        if (userRepository.findFirstByEmail(userParams.getEmail()).isPresent()) {
            throw new DataExistsException("Email exists");
        }

        // create
        University university = universityRepository
            .findById(userParams.getUniversityId())
            .orElseThrow(() -> new DataNotExistsException("University not found"));

        Users users = new Users(userParams, university);
        users.setPassword(passwordEncoder.encode(userParams.getPassword()));
        userRepository.save(users);
        return authService.login(new UserLoginParams(userParams.getEmail(), userParams.getPassword()));
    }

    @Override
    public UserResp getUserInfo(Long sourceUserId, Long targetUserId) {
        Users sourceUser = userRepository
            .findById(sourceUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        Users targetUser = userRepository
            .findById(targetUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        Permissions.sameUniversityOrSuperuser(sourceUser, targetUser.getUniversity().getId());
        Permissions.adminOrOwner(sourceUser, targetUserId);
        return new UserResp(targetUser);
    }

    @Override
    public UserResp modifyUserInfo(Long sourceUserId, Long targetUserId, UserParams userParams,
                                   boolean partial) {
        Users sourceUser = userRepository
            .findById(sourceUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        Users targetUser = userRepository
            .findById(targetUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));

        // validate
        validate(userParams, partial);
        Permissions.sameUniversityOrSuperuser(sourceUser, targetUser.getUniversity().getId());
        Permissions.adminOrOwner(sourceUser, targetUserId);
        if (!partial && !userParams.getEmail().equals(targetUser.getEmail())) {
            throw new PermissionException("Email cannot be modified");
        }
        if (!partial && !userParams.getUniversityId().equals(targetUser.getUniversity().getId())) {
            throw new PermissionException("University cannot be modified");
        }

        // update
        if (userParams.getPassword() != null) {
            targetUser.setPassword(passwordEncoder.encode(userParams.getPassword()));
        }
        if (userParams.getDob() != null) {
            targetUser.setDob(userParams.getDob());
        }
        Users savedUser = userRepository.save(targetUser);
        return new UserResp(savedUser);
    }

    @Override
    public List<UserResp> getUsers(Long sourceUserId) {
        List<Users> users = new ArrayList<>();
        Users sourceUser = userRepository
            .findById(sourceUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));

        if (sourceUser.isSuperuser()) {
            users.addAll(userRepository.findAll());
        } else if (sourceUser.isStaff()) {
            users.addAll(userRepository.findAllByUniversityId(sourceUser.getUniversity().getId()));
        }
        List<UserResp> ret = new ArrayList<>();
        for (Users user : users) {
            ret.add(new UserResp(user));
        }
        return ret;
    }

    @Override
    public void deleteUser(Long sourceUserId, Long targetUserId) {
        Users sourceUser = userRepository
            .findById(sourceUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        Users targetUser = userRepository
            .findById(targetUserId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        if (sourceUser.isStaff()) {
            Permissions.sameUniversityOrSuperuser(sourceUser, targetUser.getUniversity().getId());
        } else {
            Permissions.adminOrOwner(sourceUser, targetUserId);
        }
        userRepository.deleteById(targetUserId);
    }
}
