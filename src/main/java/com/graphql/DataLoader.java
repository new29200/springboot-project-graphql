package com.graphql;

import com.graphql.model.*;
import com.graphql.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final RangRepository rangRepository;
    private final AuthorRepository authorRepository;
    private final EditionRepository editionRepository;
    private final GenreRepository genreRepository;
    private final TypeRepository typeRepository;
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;
    private final CopyRepository copyRepository;
    private final MemberRepository memberRepository;
    private final LoanRepository loanRepository;

    @Override
    public void run(String... args) {

        // Ne charge les données que si la base est vide
        if (authorRepository.count() > 0) {
            log.info("Données déjà présentes, chargement ignoré.");
            return;
        }

        log.info("Chargement des données de test...");

        Rang admin = rangRepository.save(Rang.builder().rang("Admin").build());
        rangRepository.save(Rang.builder().rang("Librarian").build());

        Genre roman = genreRepository.save(Genre.builder().genre("Roman").build());
        genreRepository.save(Genre.builder().genre("Science-Fiction").build());
        genreRepository.save(Genre.builder().genre("Policier").build());

        Type papier = typeRepository.save(Type.builder().type("Papier").build());
        typeRepository.save(Type.builder().type("Numérique").build());

        Edition gallimard = editionRepository.save(Edition.builder()
                .editionName("Gallimard").createDate(LocalDate.of(1911, 1, 1))
                .city("Paris").country("France").build());

        editionRepository.save(Edition.builder()
                .editionName("Robert Laffont").createDate(LocalDate.of(1941, 1, 1))
                .city("Paris").country("France").build());

        Author hugo = authorRepository.save(Author.builder()
                .firstName("Victor").lastName("Hugo").country("France")
                .birthDate(LocalDate.of(1802, 2, 26)).deathDate(LocalDate.of(1885, 5, 22)).build());

        Author camus = authorRepository.save(Author.builder()
                .firstName("Albert").lastName("Camus").country("France")
                .birthDate(LocalDate.of(1913, 11, 7)).deathDate(LocalDate.of(1960, 1, 4)).build());

        Book lesMiserables = bookRepository.save(Book.builder()
                .isbn("978-2-07-040850-4").title("Les Misérables")
                .publishDate(LocalDate.of(1862, 1, 1))
                .author(hugo).edition(gallimard).genre(roman).type(papier).build());

        Book lEtranger = bookRepository.save(Book.builder()
                .isbn("978-2-07-036024-7").title("L Etranger")
                .publishDate(LocalDate.of(1942, 1, 1))
                .author(camus).edition(gallimard).genre(roman).type(papier).build());

        Library bpi = libraryRepository.save(Library.builder()
                .libraryName("BPI Centre Pompidou").createDate(LocalDate.of(1977, 1, 31))
                .location("Place Georges-Pompidou").city("Paris").nature("Publique").build());

        Copy copy1 = copyRepository.save(Copy.builder()
                .book(lesMiserables).library(bpi)
                .acquisitionDate(LocalDate.of(2010, 3, 15)).build());

        Copy copy2 = copyRepository.save(Copy.builder()
                .book(lEtranger).library(bpi)
                .acquisitionDate(LocalDate.of(2015, 6, 20)).build());

        Member alice = memberRepository.save(Member.builder()
                .lastName("Dupont").firstName("Alice").address("12 rue de la Paix")
                .postalCode("75001").city("Paris").email("alice.dupont@email.fr")
                .phone("0612345678").passWord("password123").active(true).library(bpi).build());

        loanRepository.save(Loan.builder()
                .copy(copy1).member(alice)
                .loanDate(LocalDate.now().minusDays(10))
                .dueDate(LocalDate.now().plusDays(20)).build());

        loanRepository.save(Loan.builder()
                .copy(copy2).member(alice)
                .loanDate(LocalDate.now().minusDays(30))
                .dueDate(LocalDate.now().minusDays(9))
                .returnDate(LocalDate.now().minusDays(10)).build());

        log.info("Données de test chargées !");
        log.info("GraphiQL : http://localhost:8080/graphiql");
    }
}