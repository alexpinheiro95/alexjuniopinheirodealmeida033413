package main.java.com.challenge.musicmanager.dto.controller;

import com.challenge.musicmanager.dto.response.ArtistResponseDTO;
import com.challenge.musicmanager.model.Artist;
import com.challenge.musicmanager.repository.ArtistRepository;
import com.challenge.musicmanager.service.MinioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "*") // Permite chamadas do front-end React
public class ArtistController {

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private MinioService minioService;

    /**
     * POST /api/artists
     * Consome MULTIPART_FORM_DATA para aceitar o arquivo de imagem e o nome do artista.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArtistResponseDTO> createArtist(
            @RequestParam("name") String name,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        String fileName = null;

        // 1. Se houver imagem, faz o upload para o MinIO
        if (imageFile != null && !imageFile.isEmpty()) {
            fileName = minioService.uploadImage(imageFile);
        }

        // 2. Salva o artista no PostgreSQL (guardando apenas o nome do arquivo)
        Artist artist = new Artist();
        artist.setName(name);
        artist.setImageUrl(fileName); // Salva algo como "a5b4...png"
        artist = artistRepository.save(artist);

        // 3. Monta a resposta com a URL pública
        String publicUrl = minioService.getFileUrl(artist.getImageUrl());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ArtistResponseDTO(artist.getId(), artist.getName(), publicUrl));
    }

    /**
     * GET /api/artists
     * Lista todos os artistas e resolve a URL das imagens no MinIO.
     */
    @GetMapping
    public ResponseEntity<List<ArtistResponseDTO>> getAllArtists() {
        List<Artist> artists = artistRepository.findAll();

        List<ArtistResponseDTO> response = artists.stream()
                .map(artist -> {
                    // Resolve a URL temporária para cada imagem
                    String publicUrl = minioService.getFileUrl(artist.getImageUrl());
                    return new ArtistResponseDTO(artist.getId(), artist.getName(), publicUrl);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/artists/{id}
     * Remove o artista do banco e a respectiva imagem do MinIO.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable UUID id) {
        return artistRepository.findById(id).map(artist -> {
            // 1. Deleta a imagem do MinIO (se existir)
            if (artist.getImageUrl() != null) {
                minioService.deleteImage(artist.getImageUrl());
            }

            // 2. Deleta o artista do banco de dados (o Cascade do JPA deletará os álbuns)
            artistRepository.delete(artist);
            return ResponseEntity.noContent().<Void>build();

        }).orElse(ResponseEntity.notFound().build());
    }
}