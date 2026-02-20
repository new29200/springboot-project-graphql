package com.graphql.controller;

import com.graphql.model.Copy;
import com.graphql.model.Loan;
import com.graphql.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class LoanController {

    private final LoanRepository loanRepository;
    private final CopyRepository copyRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;

    @QueryMapping
    public List<Loan> loans() { return loanRepository.findAll(); }

    @QueryMapping
    public Optional<Loan> loan(@Argument String loanId) {
        return loanRepository.findById(Integer.parseInt(loanId));
    }

    @QueryMapping
    public List<Loan> loansByMember(@Argument String memberId) {
        return loanRepository.findByMemberMemberId(Integer.parseInt(memberId));
    }

    @QueryMapping
    public List<Loan> activeLoans() { return loanRepository.findByReturnDateIsNull(); }

    @QueryMapping
    public List<Copy> copies() { return copyRepository.findAll(); }

    @QueryMapping
    public List<Copy> copiesByBook(@Argument String bookId) {
        return copyRepository.findByBookBookId(Integer.parseInt(bookId));
    }

    @QueryMapping
    public List<Copy> copiesByLibrary(@Argument String libraryId) {
        return copyRepository.findByLibraryLibraryId(Integer.parseInt(libraryId));
    }

    @MutationMapping
    public Copy createCopy(@Argument String bookId, @Argument String libraryId,
                           @Argument String acquisitionDate) {
        return copyRepository.save(Copy.builder()
                .book(bookRepository.findById(Integer.parseInt(bookId)).orElseThrow())
                .library(libraryRepository.findById(Integer.parseInt(libraryId)).orElseThrow())
                .acquisitionDate(LocalDate.parse(acquisitionDate))
                .build());
    }

    @MutationMapping
    public Loan createLoan(@Argument String copyId, @Argument String memberId,
                           @Argument String loanDate, @Argument String dueDate) {
        return loanRepository.save(Loan.builder()
                .copy(copyRepository.findById(Integer.parseInt(copyId)).orElseThrow())
                .member(memberRepository.findById(Integer.parseInt(memberId)).orElseThrow())
                .loanDate(LocalDate.parse(loanDate))
                .dueDate(LocalDate.parse(dueDate))
                .build());
    }

    @MutationMapping
    public Loan returnLoan(@Argument String loanId, @Argument String returnDate) {
        Loan loan = loanRepository.findById(Integer.parseInt(loanId))
                .orElseThrow(() -> new RuntimeException("Emprunt introuvable"));
        loan.setReturnDate(LocalDate.parse(returnDate));
        return loanRepository.save(loan);
    }
}