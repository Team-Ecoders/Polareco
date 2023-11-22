package ecoders.polareco.http.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@AllArgsConstructor
@Service
@Slf4j
public class HttpService {

    private final ObjectMapper objectMapper;

    public <B> B readRequestBody(HttpServletRequest request, Class<B> cls) throws IOException {
        return objectMapper.readValue(request.getInputStream(), cls);
    }

    public <B> void sendResponse(HttpServletResponse response, int statusCode, B body) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(statusCode);
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
