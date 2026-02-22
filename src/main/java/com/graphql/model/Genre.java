package com.graphql.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "genres")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "genre_id")
    private Integer genreId;

    @Column(name = "genre", nullable = false, length = 255)
    private String genre;

    @OneToMany(mappedBy = "genre", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Book> books;
}
