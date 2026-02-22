package com.graphql.controller;

import com.graphql.model.Rang;
import com.graphql.repository.RangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class RangController {

    private final RangRepository rangRepository;

    @QueryMapping
    public List<Rang> rangs() { return rangRepository.findAll(); }

    @MutationMapping
    public Rang createRang(@Argument String rang) {
        return rangRepository.save(Rang.builder().rang(rang).build());
    }

    @MutationMapping
    public Rang updateRang(@Argument String rangId, @Argument String rang) {
        Rang r = rangRepository.findById(Integer.valueOf(rangId))
                .orElseThrow(() -> new RuntimeException("Rang introuvable"));
        r.setRang(rang);
        return rangRepository.save(r);
    }

    @MutationMapping
    public Boolean deleteRang(@Argument String rangId) {
        rangRepository.deleteById(Integer.valueOf(rangId));
        return true;
    }
}