package ecoders.polareco.member.util;

import java.security.SecureRandom;

public class VerificationCodeIssuer {

    private static final SecureRandom secureRandom = new SecureRandom();

    private static final int codeDigits = 6;

    public static String issue() {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < codeDigits; i++) {
            int randomResult = secureRandom.nextInt(35);
            builder.append(randomResult < 10 ? (char) (randomResult + '0') : (char) (randomResult - 10 + 'a'));
        }
        return builder.toString();
    }
}
