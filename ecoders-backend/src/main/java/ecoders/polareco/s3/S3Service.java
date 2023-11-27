package ecoders.polareco.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class S3Service {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String uploadImage(MultipartFile imageFile) throws IOException {


        byte[] imageBytes = imageFile.getBytes();
        InputStream inputStream = new ByteArrayInputStream(imageBytes);
        String folderName = "images/post";
        String fileName = folderName + "/" + generateUniqueFileName();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(imageBytes.length);
        amazonS3.putObject(bucketName, fileName, inputStream, metadata);

        String url = amazonS3.getUrl(bucketName, fileName).toString();

        return url;
    }

    private String generateUniqueFileName() {
        return UUID.randomUUID().toString();
    }
}
