package com.graphql.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "copies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Copy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "copy_id")
    private Integer copyId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "library_id", nullable = false)
    private Library library;

    @Column(name = "acquisition_date", nullable = false)
    private LocalDate acquisitionDate;

    @OneToMany(mappedBy = "copy", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Loan> loans;
}
