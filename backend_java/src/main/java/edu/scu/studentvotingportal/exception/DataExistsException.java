package edu.scu.studentvotingportal.exception;

public class DataExistsException extends RuntimeException {
    public DataExistsException(String message) {
        super(message);
    }
}
