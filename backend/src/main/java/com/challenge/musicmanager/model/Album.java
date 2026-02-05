package main.java.com.challenge.musicmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "albums")
@Getter
@Setter
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String coverUrl; // Nome do arquivo no MinIO (ex: "capa-123.jpg")

    // RELACIONAMENTO: Muitos Álbuns pertencem a Um Artista
    // FetchType.LAZY = Boa prática. Só carrega o artista se pedirmos explicitamente.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false)
    @JsonIgnore // Evita loops infinitos de JSON se não usar DTOs
    private Artist artist;
}