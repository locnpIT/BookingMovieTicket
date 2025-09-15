package com.example.phuocloc.bookingmovieticket.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.Showtime;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    long countByMovie_Id(Long movieId);
    long countByRoom_Id(Long roomId);

    @Query("select s from Showtime s where (:movieId is null or s.movie.id = :movieId) and (:roomId is null or s.room.id = :roomId) and (:start is null or :end is null or (s.startTime >= :start and s.startTime < :end)) and (:q is null or lower(s.movie.title) like lower(concat('%', :q, '%')) or lower(s.room.roomNumber) like lower(concat('%', :q, '%'))) order by s.startTime asc")
    List<Showtime> findByFilters(@Param("movieId") Long movieId,
                                 @Param("roomId") Long roomId,
                                 @Param("start") OffsetDateTime start,
                                 @Param("end") OffsetDateTime end,
                                 @Param("q") String q);

    @Query("select count(s) from Showtime s where s.room.id = :roomId and (:excludeId is null or s.id <> :excludeId) and s.startTime < :endTime and s.endTime > :startTime")
    long countOverlaps(@Param("roomId") Long roomId,
                       @Param("startTime") OffsetDateTime startTime,
                       @Param("endTime") OffsetDateTime endTime,
                       @Param("excludeId") Long excludeId);
}
