package com.graphql.controller;

import com.graphql.model.Member;
import com.graphql.model.User;
import com.graphql.model.Rang;
import com.graphql.repository.LibraryRepository;
import com.graphql.repository.MemberRepository;
import com.graphql.repository.UserRepository;
import com.graphql.repository.RangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class MemberController {

    private final MemberRepository memberRepository;
    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final RangRepository rangRepository;    

    @QueryMapping
    public List<Member> members() { return memberRepository.findAll(); }

    @QueryMapping
    public Optional<Member> member(@Argument String memberId) {
        return memberRepository.findById(Integer.parseInt(memberId));
    }

    @QueryMapping
    public List<Member> membersByLibrary(@Argument String libraryId) {
        return memberRepository.findByLibraryLibraryId(Integer.parseInt(libraryId));
    }

    @QueryMapping
    public Member memberByEmail(@Argument String email) {
        return memberRepository.findByEmail(email).orElse(null);
    }

    @QueryMapping
    public List<Member> activeMembers() { return memberRepository.findByActive(true); }

    @MutationMapping
    public Member createMember(@Argument String lastName, @Argument String firstName,
                           @Argument String address, @Argument String postalCode,
                           @Argument String city, @Argument String email,
                           @Argument String phone, @Argument String passWord,
                           @Argument String libraryId) {

        Member member = memberRepository.save(Member.builder()
                .lastName(lastName).firstName(firstName).address(address)
                .postalCode(postalCode).city(city).email(email).phone(phone)
                .passWord(passWord).active(true)
                .library(libraryRepository.findById(Integer.parseInt(libraryId)).orElseThrow())
                .build());

        // Création automatique du User associé
        Rang rangMember = rangRepository.findByRang("Member")
                .orElseThrow(() -> new RuntimeException("Rang 'Member' introuvable"));

        // Vérifie que le User n'existe pas déjà (email unique)
        if (userRepository.findByEmail(email).isEmpty()) {
            userRepository.save(User.builder()
                    .lastName(lastName).firstName(firstName)
                    .address(address).postalCode(postalCode)
                    .city(city).email(email).phone(phone)
                    .passWord(lastName + postalCode) // ex: "Dupont75001"
                    .rang(rangMember)
                    .build());
        }

        return member;
    }

    @MutationMapping
    public Member updateMember(@Argument String memberId, @Argument String address,
                               @Argument String city, @Argument String phone,
                               @Argument Boolean active) {
        Member m = memberRepository.findById(Integer.parseInt(memberId))
                .orElseThrow(() -> new RuntimeException("Membre introuvable"));
        if (address != null) m.setAddress(address);
        if (city    != null) m.setCity(city);
        if (phone   != null) m.setPhone(phone);
        if (active  != null) m.setActive(active);
        return memberRepository.save(m);
    }

    @MutationMapping
    public Boolean deleteMember(@Argument String memberId) {
        memberRepository.deleteById(Integer.parseInt(memberId));
        return true;
    }
}