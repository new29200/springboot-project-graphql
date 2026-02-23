package com.graphql.repository;

import com.graphql.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Integer> {
    List<Loan> findByReturnDateIsNull();
    List<Loan> findByMemberMemberId(Integer memberId);
    List<Loan> findByCopyCopyIdAndReturnDateIsNull(Integer copyId);
}