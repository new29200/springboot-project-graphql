package com.graphql.controller;

import com.graphql.model.*;
import com.graphql.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class GraphQLController {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;
    private final MemberRepository memberRepository;
    private final CopyRepository copyRepository;
    private final LoanRepository loanRepository;
    private final EditionRepository editionRepository;
    private final GenreRepository genreRepository;
    private final TypeRepository typeRepository;
    private final RangRepository rangRepository;
    private final UserRepository userRepository;

    // ── Authors ──────────────────────────────────────────────
    @QueryMapping
    public List<Author> authors() { return authorRepository.findAll(); }

    @QueryMapping
    public Optional<Author> author(@Argument String authorId) {
        return authorRepository.findById(Integer.parseInt(authorId));
    }

    @QueryMapping
    public List<Author> authorsByCountry(@Argument String country) {
        return authorRepository.findByCountry(country);
    }

    // ── Books ────────────────────────────────────────────────
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

    // ── Libraries ────────────────────────────────────────────
    @QueryMapping
    public List<Library> libraries() { return libraryRepository.findAll(); }

    @QueryMapping
    public Optional<Library> library(@Argument String libraryId) {
        return libraryRepository.findById(Integer.parseInt(libraryId));
    }

    @QueryMapping
    public List<Library> librariesByCity(@Argument String city) {
        return libraryRepository.findByCity(city);
    }

    // ── Members ──────────────────────────────────────────────
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
    public List<Member> activeMembers() { return memberRepository.findByActive(true); }

    // ── Copies ───────────────────────────────────────────────
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

    // ── Loans ────────────────────────────────────────────────
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

    // ── Divers ───────────────────────────────────────────────
    @QueryMapping
    public List<User> users() { return userRepository.findAll(); }

    @QueryMapping
    public List<Genre> genres() { return genreRepository.findAll(); }

    @QueryMapping
    public List<Type> types() { return typeRepository.findAll(); }

    @QueryMapping
    public List<Rang> rangs() { return rangRepository.findAll(); }

    // ── Mutations Authors ────────────────────────────────────
    @MutationMapping
    public Author createAuthor(@Argument String firstName, @Argument String lastName,
                               @Argument String country, @Argument String birthDate,
                               @Argument String deathDate) {
        return authorRepository.save(Author.builder()
                .firstName(firstName).lastName(lastName).country(country)
                .birthDate(birthDate != null ? LocalDate.parse(birthDate) : null)
                .deathDate(deathDate != null ? LocalDate.parse(deathDate) : null)
                .build());
    }

    @MutationMapping
    public Author updateAuthor(@Argument String authorId, @Argument String firstName,
                               @Argument String lastName, @Argument String country) {
        Author a = authorRepository.findById(Integer.parseInt(authorId))
                .orElseThrow(() -> new RuntimeException("Auteur introuvable : " + authorId));
        if (firstName != null) a.setFirstName(firstName);
        if (lastName  != null) a.setLastName(lastName);
        if (country   != null) a.setCountry(country);
        return authorRepository.save(a);
    }

    @MutationMapping
    public Boolean deleteAuthor(@Argument String authorId) {
        authorRepository.deleteById(Integer.parseInt(authorId));
        return true;
    }

    // ── Mutations Books ──────────────────────────────────────
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

    // ── Mutations Libraries ──────────────────────────────────
    @MutationMapping
    public Library createLibrary(@Argument String libraryName, @Argument String createDate,
                                 @Argument String location, @Argument String city,
                                 @Argument String nature) {
        return libraryRepository.save(Library.builder()
                .libraryName(libraryName).createDate(LocalDate.parse(createDate))
                .location(location).city(city).nature(nature).build());
    }

    @MutationMapping
    public Library updateLibrary(@Argument String libraryId, @Argument String libraryName,
                                 @Argument String location, @Argument String city) {
        Library l = libraryRepository.findById(Integer.parseInt(libraryId))
                .orElseThrow(() -> new RuntimeException("Bibliothèque introuvable"));
        if (libraryName != null) l.setLibraryName(libraryName);
        if (location    != null) l.setLocation(location);
        if (city        != null) l.setCity(city);
        return libraryRepository.save(l);
    }

    // ── Mutations Members ────────────────────────────────────
    @MutationMapping
    public Member createMember(@Argument String lastName, @Argument String firstName,
                               @Argument String address, @Argument String postalCode,
                               @Argument String city, @Argument String email,
                               @Argument String phone, @Argument String passWord,
                               @Argument String libraryId) {
        return memberRepository.save(Member.builder()
                .lastName(lastName).firstName(firstName).address(address)
                .postalCode(postalCode).city(city).email(email).phone(phone)
                .passWord(passWord).active(true)
                .library(libraryRepository.findById(Integer.parseInt(libraryId)).orElseThrow())
                .build());
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

    // ── Mutations Copies & Loans ─────────────────────────────
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

    // ── Mutations Divers ─────────────────────────────────────
    @MutationMapping
    public Genre createGenre(@Argument String genre) {
        return genreRepository.save(Genre.builder().genre(genre).build());
    }

    @MutationMapping
    public Type createType(@Argument String type) {
        return typeRepository.save(Type.builder().type(type).build());
    }

    @MutationMapping
    public Rang createRang(@Argument String rang) {
        return rangRepository.save(Rang.builder().rang(rang).build());
    }

    @MutationMapping
    public Edition createEdition(@Argument String editionName, @Argument String createDate,
                                 @Argument String city, @Argument String country) {
        return editionRepository.save(Edition.builder()
                .editionName(editionName).createDate(LocalDate.parse(createDate))
                .city(city).country(country).build());
    }
}