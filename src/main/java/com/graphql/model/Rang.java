package com.graphql.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "rang")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rang_id")
    private Integer rangId;

    @Column(name = "rang", nullable = false, length = 255)
    private String rang;

    @OneToMany(mappedBy = "rang", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<User> users;
}
