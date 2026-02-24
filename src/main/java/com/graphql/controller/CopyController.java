package com.graphql.controller;

import com.graphql.model.Copy;
import com.graphql.repository.CopyRepository;
import com.graphql.repository.BookRepository;
import com.graphql.repository.LibraryRepository;
import com.graphql.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.time.LocalDate;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class CopyController {

    private final CopyRepository copyRepository;
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;
    private final LoanRepository loanRepository;

    @QueryMapping
    public List<Copy> copies() {
        return copyRepository.findAll();
    }

    @QueryMapping
    public List<Copy> copiesByBook(@Argument String bookId) {
        return copyRepository.findByBookBookId(Integer.valueOf(bookId));
    }

    @QueryMapping
    public List<Copy> copiesByLibrary(@Argument String libraryId) {
        return copyRepository.findByLibraryLibraryId(Integer.valueOf(libraryId));
    }
    
    @QueryMapping
    public Boolean isCopyAvailable(@Argument String copyId) {
        return loanRepository.findByCopyCopyIdAndReturnDateIsNull(Integer.valueOf(copyId)).isEmpty();
    }

    @MutationMapping
    public Copy createCopy(@Argument String bookId, @Argument String libraryId,
                           @Argument String acquisitionDate) {
        var book = bookRepository.findById(Integer.valueOf(bookId))
                .orElseThrow(() -> new RuntimeException("Livre introuvable"));
        var library = libraryRepository.findById(Integer.valueOf(libraryId))
                .orElseThrow(() -> new RuntimeException("Bibliothèque introuvable"));
        return copyRepository.save(Copy.builder()
                .book(book)
                .library(library)
                .acquisitionDate(LocalDate.parse(acquisitionDate))
                .build());
    }

    @MutationMapping
    public Boolean deleteCopy(@Argument String copyId) {
        copyRepository.deleteById(Integer.valueOf(copyId));
        return true;
    }
}