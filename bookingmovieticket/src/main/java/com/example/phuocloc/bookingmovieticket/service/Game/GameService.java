package com.example.phuocloc.bookingmovieticket.service.Game;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.phuocloc.bookingmovieticket.enums.GameType;
import com.example.phuocloc.bookingmovieticket.model.GameSession;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.model.UserPoints;
import com.example.phuocloc.bookingmovieticket.repository.GameSessionRepository;
import com.example.phuocloc.bookingmovieticket.repository.UserPointsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameService {
    private final UserPointsRepository userPointsRepository;
    private final GameSessionRepository gameSessionRepository;
    
    // Points conversion: 1 point = 10 VND discount
    private static final BigDecimal POINTS_TO_VND_RATIO = new BigDecimal("10");
    private static final int MAX_GAMES_PER_DAY = 5;
    
    /**
     * Get or create UserPoints for a user
     */
    @Transactional
    public UserPoints getOrCreateUserPoints(User user) {
        Optional<UserPoints> existing = userPointsRepository.findByUser(user);
        if (existing.isPresent()) {
            return existing.get();
        }
        UserPoints points = new UserPoints();
        points.setUser(user);
        points.setPoints(BigDecimal.ZERO);
        points.setLastUpdated(OffsetDateTime.now());
        return userPointsRepository.save(points);
    }
    
    /**
     * Check if user can play game today (max 5 games per day, except SPIN_WHEEL which is 1 per day)
     */
    public boolean canPlayGameToday(User user) {
        OffsetDateTime todayStart = OffsetDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        long gamesToday = gameSessionRepository.countByUserAndPlayedAtAfter(user, todayStart);
        return gamesToday < MAX_GAMES_PER_DAY;
    }
    
    /**
     * Check if user can play specific game type today
     */
    public boolean canPlayGameTypeToday(User user, GameType gameType) {
        OffsetDateTime todayStart = OffsetDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        
        // SPIN_WHEEL: only 1 time per day
        if (gameType == GameType.SPIN_WHEEL) {
            long spinWheelToday = gameSessionRepository.countByUserAndGameTypeAndPlayedAtAfter(user, gameType, todayStart);
            return spinWheelToday < 1;
        }
        
        // Other games: max 5 games total per day
        long gamesToday = gameSessionRepository.countByUserAndPlayedAtAfter(user, todayStart);
        return gamesToday < MAX_GAMES_PER_DAY;
    }
    
    /**
     * Calculate points based on game type and score
     */
    public BigDecimal calculatePoints(GameType gameType, Integer score) {
        BigDecimal basePoints;
        switch (gameType) {
            case MEMORY_CARD:
                // Memory card: 10-50 points based on score (max score usually 100)
                basePoints = new BigDecimal(score).multiply(new BigDecimal("0.5"));
                break;
            case QUIZ:
                // Quiz: 20-100 points based on correct answers
                basePoints = new BigDecimal(score).multiply(new BigDecimal("10"));
                break;
            case SPIN_WHEEL:
                // Spin wheel: random 50-200 points
                basePoints = new BigDecimal(50 + (int)(Math.random() * 150));
                break;
            case CLICK_RACE:
                // Click race: 5-30 points based on clicks
                basePoints = new BigDecimal(score).multiply(new BigDecimal("0.3"));
                break;
            default:
                basePoints = BigDecimal.ZERO;
        }
        return basePoints.setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Submit game result and award points
     */
    @Transactional
    public GameSession submitGameResult(User user, GameType gameType, Integer score, String gameData) {
        if (!canPlayGameTypeToday(user, gameType)) {
            if (gameType == GameType.SPIN_WHEEL) {
                throw new IllegalStateException("Bạn đã quay vòng quay may mắn hôm nay. Vui lòng quay lại vào ngày mai!");
            }
            throw new IllegalStateException("Bạn đã chơi hết lượt hôm nay. Vui lòng quay lại vào ngày mai!");
        }
        
        BigDecimal pointsEarned = calculatePoints(gameType, score);
        
        // Save game session
        GameSession session = new GameSession();
        session.setUser(user);
        session.setGameType(gameType);
        session.setScore(score);
        session.setPointsEarned(pointsEarned);
        session.setPlayedAt(OffsetDateTime.now());
        session.setGameData(gameData);
        session = gameSessionRepository.save(session);
        
        // Add points to user
        UserPoints userPoints = getOrCreateUserPoints(user);
        userPoints.addPoints(pointsEarned);
        userPointsRepository.save(userPoints);
        
        return session;
    }
    
    /**
     * Get user's current points
     */
    public BigDecimal getUserPoints(User user) {
        UserPoints userPoints = getOrCreateUserPoints(user);
        return userPoints.getPoints();
    }
    
    /**
     * Convert points to VND discount
     */
    public BigDecimal pointsToVndDiscount(BigDecimal points) {
        return points.multiply(POINTS_TO_VND_RATIO).setScale(0, RoundingMode.DOWN);
    }
    
    /**
     * Convert VND discount to points needed
     */
    public BigDecimal vndDiscountToPoints(BigDecimal vndAmount) {
        return vndAmount.divide(POINTS_TO_VND_RATIO, 2, RoundingMode.UP);
    }
    
    /**
     * Use points for discount
     */
    @Transactional
    public void usePointsForDiscount(User user, BigDecimal pointsToUse) {
        UserPoints userPoints = getOrCreateUserPoints(user);
        if (userPoints.getPoints().compareTo(pointsToUse) < 0) {
            throw new IllegalArgumentException("Không đủ điểm để sử dụng");
        }
        userPoints.deductPoints(pointsToUse);
        userPointsRepository.save(userPoints);
    }
    
    /**
     * Get user's game history
     */
    public List<GameSession> getUserGameHistory(User user, int limit) {
        List<GameSession> sessions = gameSessionRepository.findByUser_IdOrderByPlayedAtDesc(user.getId());
        return sessions.size() > limit ? sessions.subList(0, limit) : sessions;
    }
    
    /**
     * Generate quiz questions (simple implementation)
     */
    public List<QuizQuestion> generateQuizQuestions() {
        List<QuizQuestion> questions = new ArrayList<>();
        
        questions.add(new QuizQuestion(
            "Phim nào đạt giải Oscar Phim hay nhất năm 2023?",
            List.of("Everything Everywhere All at Once", "Top Gun: Maverick", "The Banshees of Inisherin", "Avatar: The Way of Water"),
            0
        ));
        
        questions.add(new QuizQuestion(
            "Ai là đạo diễn của bộ phim 'Inception'?",
            List.of("Christopher Nolan", "Steven Spielberg", "Martin Scorsese", "Quentin Tarantino"),
            0
        ));
        
        questions.add(new QuizQuestion(
            "Phim Việt Nam nào đạt doanh thu cao nhất năm 2023?",
            List.of("Nhà Bà Nữ", "Đất Rừng Phương Nam", "Mai", "Lật Mặt 7"),
            2
        ));
        
        questions.add(new QuizQuestion(
            "Giải thưởng điện ảnh danh giá nhất thế giới là gì?",
            List.of("Oscar", "Cannes", "Venice", "Berlin"),
            0
        ));
        
        questions.add(new QuizQuestion(
            "Phim nào có thời lượng dài nhất trong lịch sử điện ảnh?",
            List.of("The Cure for Insomnia", "Logistics", "Modern Times Forever", "The Clock"),
            0
        ));
        
        Collections.shuffle(questions);
        return questions.subList(0, Math.min(5, questions.size()));
    }
    
    public static class QuizQuestion {
        private String question;
        private List<String> options;
        private Integer correctAnswer;
        
        public QuizQuestion(String question, List<String> options, Integer correctAnswer) {
            this.question = question;
            this.options = options;
            this.correctAnswer = correctAnswer;
        }
        
        public String getQuestion() { return question; }
        public List<String> getOptions() { return options; }
        public Integer getCorrectAnswer() { return correctAnswer; }
    }
}

