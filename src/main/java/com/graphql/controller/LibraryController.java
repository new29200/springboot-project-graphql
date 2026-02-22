package com.graphql.controller;

import com.graphql.model.Library;
import com.graphql.repository.LibraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryRepository libraryRepository;

    @QueryMapping
    public List<Library> libraries() { return libraryRepository.findAll(); }

    @QueryMapping
    public Optional<Library> library(@Argument String libraryId) {
        return libraryRepository.findById(Integer.parseInt(libraryId));
    }

    @QueryMapping
    public List<Library> librariesByCity(@Argument String city) {
        return libraryRepository.findByCity(city);
    }

    @MutationMapping
    public Library createLibrary(@Argument String libraryName, @Argument String createDate,
                                 @Argument String location, @Argument String city,
                                 @Argument String nature) {
        return libraryRepository.save(Library.builder()
                .libraryName(libraryName).createDate(LocalDate.parse(createDate))
                .location(location).city(city).nature(nature).build());
    }

    @MutationMapping
    public Library updateLibrary(@Argument String libraryId, @Argument String libraryName,
                                 @Argument String location, @Argument String city) {
        Library l = libraryRepository.findById(Integer.parseInt(libraryId))
                .orElseThrow(() -> new RuntimeException("Bibliothèque introuvable"));
        if (libraryName != null) l.setLibraryName(libraryName);
        if (location    != null) l.setLocation(location);
        if (city        != null) l.setCity(city);
        return libraryRepository.save(l);
    }
}