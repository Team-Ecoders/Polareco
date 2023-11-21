package ecoders.polareco.auth.util;

import ecoders.polareco.auth.user.PolarecoUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuthUtil {

    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PolarecoUserDetails userDetails = (PolarecoUserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }
}
