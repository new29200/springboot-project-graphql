package com.graphql.repository;
import com.graphql.model.Copy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CopyRepository extends JpaRepository<Copy, Integer> {
    List<Copy> findByBookBookId(Integer bookId);
    List<Copy> findByLibraryLibraryId(Integer libraryId);
}
