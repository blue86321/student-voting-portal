package edu.scu.studentvotingportal.utils;

import lombok.Data;

import java.util.HashMap;

@Data
public class Resp {

    int code;
    Boolean success;
    String msg;
    Object data;

    public Resp(Integer code, boolean success) {
        this.code = code;
        this.success = success;
        this.msg = "";
        this.data = new HashMap<>();
    }

    public Resp(Integer code, boolean success, String msg) {
        this.code = code;
        this.success = success;
        this.msg = msg;
        this.data = new HashMap<>();
    }

    public Resp(Integer code, boolean success, String msg, Object data) {
        this.code = code;
        this.success = success;
        this.msg = msg;
        this.data = data;
    }

    public static Resp Success() {
        return new Resp(200, true);
    }

    public static Resp Success(int code) {
        return new Resp(code, true);
    }

    public static Resp Success(Object data) {
        return new Resp(200, true, "", data);
    }

    public static Resp Success(int code, Object data) {
        return new Resp(code, true, "", data);
    }

    public static Resp Fail(String msg) {
        return new Resp(400, false, msg);
    }

    public static Resp Fail(int code) {
        return new Resp(code, false, "");
    }

    public static Resp Fail(int code, String msg) {
        return new Resp(code, false, msg);
    }
}
