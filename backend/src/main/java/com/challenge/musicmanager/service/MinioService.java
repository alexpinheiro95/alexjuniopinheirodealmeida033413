package main.java.com.challenge.musicmanager.service;

import io.minio.*;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class MinioService {

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucket-name:music-manager-bucket}")
    private String bucketName;

    /**
     * Faz o upload da imagem e retorna o nome único do arquivo gerado.
     */
    public String uploadImage(MultipartFile file) {
        try {
            // Garante que o bucket existe antes de salvar
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!bucketExists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            // Gera um nome único para o arquivo (ex: a5b4c3...-minhafoto.png)
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = UUID.randomUUID() + extension;

            // Faz o upload do arquivo via InputStream
            InputStream inputStream = file.getInputStream();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, inputStream.available(), -1)
                            .contentType(file.getContentType())
                            .build());

            return fileName;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload da imagem no MinIO: " + e.getMessage());
        }
    }

    /**
     * Gera uma URL de leitura temporária (válida por 1 hora) para o frontend exibir a imagem.
     * Abordagem segura em nível Sênior.
     */
    public String getFileUrl(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return null;
        }
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(fileName)
                            .expiry(1, TimeUnit.HOURS)
                            .build());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar URL da imagem: " + e.getMessage());
        }
    }

    /**
     * Remove o arquivo do MinIO. Usado quando um Artista ou Álbum é deletado do banco de dados.
     */
    public void deleteImage(String fileName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar imagem no MinIO: " + e.getMessage());
        }
    }
}