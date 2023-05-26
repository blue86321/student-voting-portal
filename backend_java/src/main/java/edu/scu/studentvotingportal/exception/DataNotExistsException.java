package edu.scu.studentvotingportal.exception;

public class DataNotExistsException extends RuntimeException {
    public DataNotExistsException(String message) {
        super(message);
    }
}
