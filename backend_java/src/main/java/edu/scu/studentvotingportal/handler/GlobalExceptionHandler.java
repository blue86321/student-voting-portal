package edu.scu.studentvotingportal.handler;


import edu.scu.studentvotingportal.exception.DataExistsException;
import edu.scu.studentvotingportal.exception.DataNotExistsException;
import edu.scu.studentvotingportal.exception.PermissionException;
import edu.scu.studentvotingportal.exception.ValidationException;
import edu.scu.studentvotingportal.utils.Resp;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PermissionException.class)
    public ResponseEntity<Resp> handlePermissionException(Exception ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Resp.Fail(HttpStatus.FORBIDDEN.value(),
            ex.getMessage()));
    }

    @ExceptionHandler({ValidationException.class, DataNotExistsException.class, DataExistsException.class})
    public ResponseEntity<Resp> handleBadRequestException(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Resp.Fail(HttpStatus.BAD_REQUEST.value(),
            ex.getMessage()));
    }
}
