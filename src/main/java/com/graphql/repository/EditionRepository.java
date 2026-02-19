package com.graphql.repository;
import com.graphql.model.Edition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface EditionRepository extends JpaRepository<Edition, Integer> {}
