package edu.scu.studentvotingportal.utils;

import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.exception.PermissionException;

public class Permissions {
    public static void sameUniversityOrSuperuser(Users sourceUser, Long universityId) {
        if (
            // not superuser
            !sourceUser.isSuperuser() &&
            // diff university
            !sourceUser.getUniversity().getId().equals(universityId)
        ) {
            throw new PermissionException("Permission denied");
        }
    }
    public static void admin(Users user) {
        if (!user.isStaff()) {
            throw new PermissionException("Permission denied");
        }
    }

    public static void superuser(Users user) {
        if (!user.isSuperuser()) {
            throw new PermissionException("Permission denied");
        }
    }

    public static void adminOrOwner(Users sourceUser, Long targetUserId) {
        if (!sourceUser.getId().equals(targetUserId) && !sourceUser.isStaff()) {
            throw new PermissionException("Normal sourceUser can only check his/her own info");
        }
    }

}
