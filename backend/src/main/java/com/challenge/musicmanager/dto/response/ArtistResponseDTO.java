package main.java.com.challenge.musicmanager.dto.response;

import java.util.UUID;

public record ArtistResponseDTO(
    UUID id,
    String name,
    String imageUrl // Aqui enviaremos a URL pública do MinIO gerada dinamicamente
) {}