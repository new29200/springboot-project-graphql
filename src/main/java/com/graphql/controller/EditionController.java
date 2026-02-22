package com.graphql.controller;

import com.graphql.model.Edition;
import com.graphql.repository.EditionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.time.LocalDate;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class EditionController {

    private final EditionRepository editionRepository;

    @QueryMapping
    public List<Edition> editions() { return editionRepository.findAll(); }

    @MutationMapping
    public Edition createEdition(@Argument String editionName, @Argument String createDate,
                                 @Argument String city, @Argument String country) {
        return editionRepository.save(Edition.builder()
                .editionName(editionName).createDate(LocalDate.parse(createDate))
                .city(city).country(country).build());
    }

    @MutationMapping
    public Edition updateEdition(@Argument String editionId, @Argument String editionName,
                                 @Argument String city, @Argument String country) {
        Edition e = editionRepository.findById(Integer.valueOf(editionId))
                .orElseThrow(() -> new RuntimeException("Edition introuvable"));
        if (editionName != null) e.setEditionName(editionName);
        if (city != null) e.setCity(city);
        if (country != null) e.setCountry(country);
        return editionRepository.save(e);
    }

    @MutationMapping
    public Boolean deleteEdition(@Argument String editionId) {
        editionRepository.deleteById(Integer.valueOf(editionId));
        return true;
    }
}