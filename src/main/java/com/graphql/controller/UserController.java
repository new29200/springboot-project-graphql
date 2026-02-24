package com.graphql.controller;

import com.graphql.model.User;
import com.graphql.model.Rang;
import com.graphql.repository.UserRepository;
import com.graphql.repository.RangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final RangRepository rangRepository;

    @QueryMapping
    public List<User> users() {
        return userRepository.findAll();
    }

    @QueryMapping
    public Optional<User> user(@Argument String userId) {
        return userRepository.findById(Integer.valueOf(userId));
    }

    @QueryMapping
    public User userByEmail(@Argument String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // Login — vérifie email + password
    @MutationMapping
    public User login(@Argument String email, @Argument String passWord) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassWord().equals(passWord))
                .orElse(null);
    }

    @MutationMapping
    public User createUser(
        @Argument String lastName, 
        @Argument String firstName,
        @Argument String address, 
        @Argument String postalCode,
        @Argument String city, 
        @Argument String email,
        @Argument String phone, 
        @Argument String passWord,
        @Argument String rangId
    ) {
        Rang rang = rangRepository.findById(Integer.valueOf(rangId))
                .orElseThrow(() -> new RuntimeException("Rang introuvable"));
        return userRepository.save(User.builder()
                .lastName(lastName).firstName(firstName)
                .address(address).postalCode(postalCode)
                .city(city).email(email)
                .phone(phone).passWord(passWord)
                .rang(rang)
                .build());
    }

    @MutationMapping
    public User updateUser(@Argument String userId, @Argument String lastName,
                           @Argument String firstName, @Argument String email,
                           @Argument String city) {
        User u = userRepository.findById(Integer.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User introuvable"));
        if (lastName  != null) u.setLastName(lastName);
        if (firstName != null) u.setFirstName(firstName);
        if (email     != null) u.setEmail(email);
        if (city      != null) u.setCity(city);
        return userRepository.save(u);
    }

    @MutationMapping
    public Boolean deleteUser(@Argument String userId) {
        userRepository.deleteById(Integer.valueOf(userId));
        return true;
    }
}