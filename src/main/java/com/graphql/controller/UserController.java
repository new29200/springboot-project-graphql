package com.graphql.controller;

import com.graphql.model.User;
import com.graphql.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @QueryMapping
    public List<User> users() { return userRepository.findAll(); }

    @QueryMapping
    public Optional<User> user(@Argument String userId) {
        return userRepository.findById(Integer.valueOf(userId));
    }
}