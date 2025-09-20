package com.example.phuocloc.bookingmovieticket.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    long countByShowtime_Id(Long showtimeId);

    @EntityGraph(attributePaths = {"tickets", "tickets.showSeat", "tickets.showSeat.seat", "showtime"})
    List<Booking> findByUser_IdOrderByBookingTimeDesc(Long userId);

    @Query("select coalesce(sum(b.totalPrice),0) from Booking b")
    java.math.BigDecimal sumTotalRevenue();

    @Query("select coalesce(sum(b.totalPrice),0) from Booking b where b.bookingTime >= :start")
    java.math.BigDecimal sumRevenueSince(@Param("start") OffsetDateTime start);

    @Query(value = "SELECT DATE(b.booking_time) AS booking_date, COALESCE(SUM(b.total_price),0) AS revenue, COUNT(DISTINCT b.id) AS booking_count, COUNT(t.id) AS ticket_count " +
                   "FROM booking b LEFT JOIN tickets t ON t.booking_id = b.id " +
                   "WHERE b.booking_time >= :start " +
                   "GROUP BY DATE(b.booking_time) " +
                   "ORDER BY DATE(b.booking_time)", nativeQuery = true)
    List<Object[]> findDailyRevenueSinceNative(@Param("start") OffsetDateTime start);

    @Query(value = "SELECT m.id AS movie_id, m.title AS movie_title, COALESCE(SUM(b.total_price),0) AS revenue, COUNT(b.id) AS booking_count " +
                   "FROM booking b JOIN showtime s ON s.id = b.showtime_id JOIN movie m ON m.id = s.movie_id " +
                   "WHERE b.booking_time >= :start " +
                   "GROUP BY m.id, m.title " +
                   "ORDER BY revenue DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findTopMovieRevenueSinceNative(@Param("start") OffsetDateTime start);
}
