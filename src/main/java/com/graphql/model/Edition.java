package com.graphql.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "editions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Edition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "edition_id")
    private Integer editionId;

    @Column(name = "edition_name", nullable = false, length = 50)
    private String editionName;

    @Column(name = "create_date", nullable = false)
    private LocalDate createDate;

    @Column(name = "city", nullable = false, length = 50)
    private String city;

    @Column(name = "country", nullable = false, length = 50)
    private String country;

    @OneToMany(mappedBy = "edition", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Book> books;
}
