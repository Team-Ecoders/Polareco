package ecoders.polareco.aws.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import ecoders.polareco.error.exception.BusinessLogicException;
import ecoders.polareco.error.exception.ExceptionCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
@Transactional
public class S3Service {

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    private final AmazonS3 amazonS3Client;

    public String uploadImage(MultipartFile imageFile, ImageType imageType) {
        try {
            byte[] imageBytes = imageFile.getBytes();
            InputStream inputStream = new ByteArrayInputStream(imageBytes);
            // 이미지 확장자
            String extension = StringUtils.getFilenameExtension(imageFile.getOriginalFilename());
            // 이미지 유형과 확장자를 가지고 S3 URL을 생성한다.
            String imageDirectory = generateImageDirectory(imageType, extension);
            // 이미지 메타데이터
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(imageBytes.length);
            // S3 버킷에 이미지를 업로드한다.
            amazonS3Client.putObject(bucketName, imageDirectory, inputStream, metadata);
            // 업로드된 이미지의 URL을 반환한다.
            return amazonS3Client.getUrl(bucketName, imageDirectory).toString();
        } catch (Exception exception) {
            throw new BusinessLogicException(ExceptionCode.IMAGE_UPLOAD_FAILED);
        }
    }

    private String generateImageDirectory(ImageType imageType, String extension) {
        return imageType.getS3Directory() + "/" + generateUniqueFileName() + "." + extension;
    }

    private String generateUniqueFileName() {
        return UUID.randomUUID().toString();
    }

    @AllArgsConstructor
    @Getter
    public
    enum ImageType {

        POST("images/post"),
        PROFILE("images/profile");

        private final String s3Directory;
    }
}
