package com.graphql.controller;

import com.graphql.model.*;
import com.graphql.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.time.LocalDate;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ReferenceController {

    private final GenreRepository genreRepository;
    private final TypeRepository typeRepository;
    private final RangRepository rangRepository;
    private final EditionRepository editionRepository;
    private final UserRepository userRepository;

    @QueryMapping
    public List<Genre> genres() { return genreRepository.findAll(); }

    @QueryMapping
    public List<Type> types() { return typeRepository.findAll(); }

    @QueryMapping
    public List<Rang> rangs() { return rangRepository.findAll(); }

    @QueryMapping
    public List<User> users() { return userRepository.findAll(); }

    @MutationMapping
    public Genre createGenre(@Argument String genre) {
        return genreRepository.save(Genre.builder().genre(genre).build());
    }

    @MutationMapping
    public Type createType(@Argument String type) {
        return typeRepository.save(Type.builder().type(type).build());
    }

    @MutationMapping
    public Rang createRang(@Argument String rang) {
        return rangRepository.save(Rang.builder().rang(rang).build());
    }

    @MutationMapping
    public Edition createEdition(@Argument String editionName, @Argument String createDate,
                                 @Argument String city, @Argument String country) {
        return editionRepository.save(Edition.builder()
                .editionName(editionName).createDate(LocalDate.parse(createDate))
                .city(city).country(country).build());
    }
}