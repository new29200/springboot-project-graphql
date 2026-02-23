package com.graphql.repository;
import com.graphql.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Integer> {
    List<Loan> findByMemberMemberId(Integer memberId);
    List<Loan> findByCopyCopyId(Integer copyId);
    List<Loan> findByReturnDateIsNull();
    List<Loan> findByMemberMemberIdAndReturnDateIsNull(Integer memberId);
    Optional<Loan> findByCopyCopyIdAndReturnDateIsNull(Integer copyId);
}
