package com.graphql.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "libraries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Library {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "library_id")
    private Integer libraryId;

    @Column(name = "library_name", nullable = false, length = 50)
    private String libraryName;

    @Column(name = "create_date", nullable = false)
    private LocalDate createDate;

    @Column(name = "location", nullable = false, length = 50)
    private String location;

    @Column(name = "city", nullable = false, length = 50)
    private String city;

    @Column(name = "nature", nullable = false, length = 50)
    private String nature;

    @Column(name = "end_date")
    private LocalDate endDate;

    @OneToMany(mappedBy = "library", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Copy> copies;

    @OneToMany(mappedBy = "library", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Member> members;
}
