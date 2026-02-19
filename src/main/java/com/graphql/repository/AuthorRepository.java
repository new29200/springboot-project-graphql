package com.graphql.repository;
import com.graphql.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AuthorRepository extends JpaRepository<Author, Integer> {
    List<Author> findByCountry(String country);
    List<Author> findByLastNameContainingIgnoreCase(String lastName);
}
