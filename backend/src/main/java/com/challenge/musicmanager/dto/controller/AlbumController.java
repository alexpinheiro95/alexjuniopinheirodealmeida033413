package main.java.com.challenge.musicmanager.controller;

import com.challenge.musicmanager.dto.response.AlbumResponseDTO;
import com.challenge.musicmanager.model.Album;
import com.challenge.musicmanager.model.Artist;
import com.challenge.musicmanager.repository.AlbumRepository;
import com.challenge.musicmanager.repository.ArtistRepository;
import com.challenge.musicmanager.service.MinioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/albums")
@CrossOrigin(origins = "*")
public class AlbumController {

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private MinioService minioService;

    /**
     * POST /api/albums
     * Cria um álbum associado a um artista.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AlbumResponseDTO> createAlbum(
            @RequestParam("artistId") UUID artistId,
            @RequestParam("title") String title,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        // 1. Verifica se o Artista existe (Integridade Referencial)
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Artista não encontrado"));

        String fileName = null;

        // 2. Upload da Capa (se enviada)
        if (imageFile != null && !imageFile.isEmpty()) {
            fileName = minioService.uploadImage(imageFile);
        }

        // 3. Salva o Álbum
        Album album = new Album();
        album.setTitle(title);
        album.setCoverUrl(fileName);
        album.setArtist(artist); // Associa o álbum ao objeto Artista recuperado
        
        album = albumRepository.save(album);

        // 4. Retorna DTO com URL pública
        String publicUrl = minioService.getFileUrl(album.getCoverUrl());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AlbumResponseDTO(album.getId(), album.getTitle(), publicUrl, artist.getId()));
    }

    /**
     * GET /api/albums?artistId=...
     * Lista os álbuns de um artista específico.
     */
    @GetMapping
    public ResponseEntity<List<AlbumResponseDTO>> getAlbumsByArtist(@RequestParam("artistId") UUID artistId) {
        
        List<Album> albums = albumRepository.findByArtistId(artistId);

        List<AlbumResponseDTO> response = albums.stream()
                .map(album -> {
                    String publicUrl = minioService.getFileUrl(album.getCoverUrl());
                    return new AlbumResponseDTO(album.getId(), album.getTitle(), publicUrl, album.getArtist().getId());
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
    
    /**
     * DELETE /api/albums/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable UUID id) {
        return albumRepository.findById(id).map(album -> {
            if (album.getCoverUrl() != null) {
                minioService.deleteImage(album.getCoverUrl());
            }
            albumRepository.delete(album);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}