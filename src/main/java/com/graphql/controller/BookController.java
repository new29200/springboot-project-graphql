package com.graphql.controller;

import com.graphql.model.Book;
import com.graphql.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class BookController {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final EditionRepository editionRepository;
    private final GenreRepository genreRepository;
    private final TypeRepository typeRepository;

    @QueryMapping
    public List<Book> books() { return bookRepository.findAll(); }

    @QueryMapping
    public Optional<Book> book(@Argument String bookId) {
        return bookRepository.findById(Integer.parseInt(bookId));
    }

    @QueryMapping
    public Optional<Book> bookByIsbn(@Argument String isbn) {
        return bookRepository.findByIsbn(isbn);
    }

    @QueryMapping
    public List<Book> booksByTitle(@Argument String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    @QueryMapping
    public List<Book> booksByAuthor(@Argument String authorId) {
        return bookRepository.findByAuthorAuthorId(Integer.parseInt(authorId));
    }

    @QueryMapping
    public List<Book> booksByGenre(@Argument String genreId) {
        return bookRepository.findByGenreGenreId(Integer.parseInt(genreId));
    }

    @MutationMapping
    public Book createBook(@Argument String isbn, @Argument String title,
                           @Argument String publishDate, @Argument String authorId,
                           @Argument String editionId, @Argument String genreId,
                           @Argument String typeId) {
        return bookRepository.save(Book.builder()
                .isbn(isbn).title(title).publishDate(LocalDate.parse(publishDate))
                .author(authorRepository.findById(Integer.parseInt(authorId)).orElseThrow())
                .edition(editionRepository.findById(Integer.parseInt(editionId)).orElseThrow())
                .genre(genreRepository.findById(Integer.parseInt(genreId)).orElseThrow())
                .type(typeRepository.findById(Integer.parseInt(typeId)).orElseThrow())
                .build());
    }

    @MutationMapping
    public Boolean deleteBook(@Argument String bookId) {
        bookRepository.deleteById(Integer.parseInt(bookId));
        return true;
    }
}