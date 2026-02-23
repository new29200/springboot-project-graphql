package com.graphql.controller;

import com.graphql.model.*;
import com.graphql.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class LoanController {

    private final LoanRepository loanRepository;
    private final CopyRepository copyRepository;
    private final MemberRepository memberRepository;

    @QueryMapping
    public List<Loan> loans() {
        return loanRepository.findAll();
    }

    @QueryMapping
    public Optional<Loan> loan(@Argument String loanId) {
        return loanRepository.findById(Integer.valueOf(loanId));
    }

    @QueryMapping
    public List<Loan> loansByMember(@Argument String memberId) {
        return loanRepository.findByMemberMemberId(Integer.valueOf(memberId));
    }

    @QueryMapping
    public List<Loan> activeLoans() {
        return loanRepository.findByReturnDateIsNull();
    }

    @MutationMapping
    public Loan createLoan(@Argument String copyId, @Argument String memberId,
                           @Argument String loanDate, @Argument String dueDate) {
        Copy copy = copyRepository.findById(Integer.valueOf(copyId))
                .orElseThrow(() -> new RuntimeException("Copie introuvable"));
        Member member = memberRepository.findById(Integer.valueOf(memberId))
                .orElseThrow(() -> new RuntimeException("Membre introuvable"));

        // Vérifier disponibilité
        boolean available = loanRepository.findByCopyCopyIdAndReturnDateIsNull(Integer.valueOf(copyId)).isEmpty();
        if (!available) throw new RuntimeException("Cette copie est déjà empruntée");

        return loanRepository.save(Loan.builder()
                .copy(copy).member(member)
                .loanDate(java.time.LocalDate.parse(loanDate))
                .dueDate(java.time.LocalDate.parse(dueDate))
                .build());
    }

    @MutationMapping
    public Loan returnLoan(@Argument String loanId, @Argument String returnDate) {
        Loan loan = loanRepository.findById(Integer.valueOf(loanId))
                .orElseThrow(() -> new RuntimeException("Prêt introuvable"));
        loan.setReturnDate(java.time.LocalDate.parse(returnDate));
        return loanRepository.save(loan);
    }
}