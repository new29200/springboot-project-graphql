package com.graphql.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Type {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private Integer typeId;

    @Column(name = "type", nullable = false, length = 255)
    private String type;

    @OneToMany(mappedBy = "type", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Book> books;
}
