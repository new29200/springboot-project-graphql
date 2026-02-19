package com.graphql.repository;
import com.graphql.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface TypeRepository extends JpaRepository<Type, Integer> {}
