package com.graphql.controller;

import com.graphql.model.Type;
import com.graphql.repository.TypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class TypeController {

    private final TypeRepository typeRepository;

    @QueryMapping
    public List<Type> types() { return typeRepository.findAll(); }

    @MutationMapping
    public Type createType(@Argument String type) {
        return typeRepository.save(Type.builder().type(type).build());
    }

    @MutationMapping
    public Type updateType(@Argument String typeId, @Argument String type) {
        Type t = typeRepository.findById(Integer.valueOf(typeId))
                .orElseThrow(() -> new RuntimeException("Type introuvable"));
        t.setType(type);
        return typeRepository.save(t);
    }

    @MutationMapping
    public Boolean deleteType(@Argument String typeId) {
        typeRepository.deleteById(Integer.valueOf(typeId));
        return true;
    }
}