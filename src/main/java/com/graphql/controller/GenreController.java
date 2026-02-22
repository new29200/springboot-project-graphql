package com.graphql.controller;

import com.graphql.model.Genre;
import com.graphql.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class GenreController {

    private final GenreRepository genreRepository;

    @QueryMapping
    public List<Genre> genres() { return genreRepository.findAll(); }

    @MutationMapping
    public Genre createGenre(@Argument String genre) {
        return genreRepository.save(Genre.builder().genre(genre).build());
    }

    @MutationMapping
    public Genre updateGenre(@Argument String genreId, @Argument String genre) {
        Genre g = genreRepository.findById(Integer.valueOf(genreId))
                .orElseThrow(() -> new RuntimeException("Genre introuvable"));
        g.setGenre(genre);
        return genreRepository.save(g);
    }

    @MutationMapping
    public Boolean deleteGenre(@Argument String genreId) {
        genreRepository.deleteById(Integer.valueOf(genreId));
        return true;
    }
}