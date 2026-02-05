package main.java.com.challenge.musicmanager.repository;

import com.challenge.musicmanager.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AlbumRepository extends JpaRepository<Album, UUID> {
    // O Spring Data JPA cria o SQL automaticamente baseado no nome do método:
    // SELECT * FROM albums WHERE artist_id = ?
    List<Album> findByArtistId(UUID artistId);
}