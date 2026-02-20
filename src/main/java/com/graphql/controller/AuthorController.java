package com.graphql.controller;

import com.graphql.model.Author;
import com.graphql.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorRepository authorRepository;

    @QueryMapping
    public List<Author> authors() { return authorRepository.findAll(); }

    @QueryMapping
    public Optional<Author> author(@Argument String authorId) {
        return authorRepository.findById(Integer.parseInt(authorId));
    }

    @QueryMapping
    public List<Author> authorsByCountry(@Argument String country) {
        return authorRepository.findByCountry(country);
    }

    @MutationMapping
    public Author createAuthor(@Argument String firstName, @Argument String lastName,
                               @Argument String country, @Argument String birthDate,
                               @Argument String deathDate) {
        return authorRepository.save(Author.builder()
                .firstName(firstName).lastName(lastName).country(country)
                .birthDate(birthDate != null ? LocalDate.parse(birthDate) : null)
                .deathDate(deathDate != null ? LocalDate.parse(deathDate) : null)
                .build());
    }

    @MutationMapping
    public Author updateAuthor(@Argument String authorId, @Argument String firstName,
                               @Argument String lastName, @Argument String country) {
        Author a = authorRepository.findById(Integer.parseInt(authorId))
                .orElseThrow(() -> new RuntimeException("Auteur introuvable : " + authorId));
        if (firstName != null) a.setFirstName(firstName);
        if (lastName  != null) a.setLastName(lastName);
        if (country   != null) a.setCountry(country);
        return authorRepository.save(a);
    }

    @MutationMapping
    public Boolean deleteAuthor(@Argument String authorId) {
        authorRepository.deleteById(Integer.parseInt(authorId));
        return true;
    }
}