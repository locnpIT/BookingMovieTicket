package com.example.phuocloc.bookingmovieticket.Controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Game.GameResultDTO;
import com.example.phuocloc.bookingmovieticket.model.GameSession;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.request.Game.SubmitGameRequest;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.security.CustomUserDetails;
import com.example.phuocloc.bookingmovieticket.service.Game.GameService;
import com.example.phuocloc.bookingmovieticket.service.Game.GameService.QuizQuestion;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;
    
    @GetMapping("/points")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<BigDecimal>> getPoints(Authentication auth) {
        User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        BigDecimal points = gameService.getUserPoints(user);
        return ResponseEntity.ok(new ApiResponse<>(
            true, 
            "Lấy điểm thành công", 
            points, 
            HttpStatus.OK.value(), 
            java.time.LocalDateTime.now()
        ));
    }
    
    @GetMapping("/can-play")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<Boolean>> canPlayGame(Authentication auth) {
        User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        boolean canPlay = gameService.canPlayGameToday(user);
        return ResponseEntity.ok(new ApiResponse<>(
            true, 
            canPlay ? "Bạn có thể chơi game" : "Bạn đã hết lượt chơi hôm nay", 
            canPlay, 
            HttpStatus.OK.value(), 
            java.time.LocalDateTime.now()
        ));
    }
    
    @GetMapping("/can-play/{gameType}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<Boolean>> canPlayGameType(
            @PathVariable("gameType") com.example.phuocloc.bookingmovieticket.enums.GameType gameType,
            Authentication auth) {
        User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        boolean canPlay = gameService.canPlayGameTypeToday(user, gameType);
        String message = canPlay 
            ? "Bạn có thể chơi game này" 
            : (gameType == com.example.phuocloc.bookingmovieticket.enums.GameType.SPIN_WHEEL 
                ? "Bạn đã quay vòng quay may mắn hôm nay" 
                : "Bạn đã hết lượt chơi hôm nay");
        return ResponseEntity.ok(new ApiResponse<>(
            true, 
            message, 
            canPlay, 
            HttpStatus.OK.value(), 
            java.time.LocalDateTime.now()
        ));
    }
    
    @PostMapping("/submit")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<GameResultDTO>> submitGame(
            @Valid @RequestBody SubmitGameRequest request,
            Authentication auth) {
        try {
            User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
            
            GameSession session = gameService.submitGameResult(
                user, 
                request.getGameType(), 
                request.getScore(),
                request.getGameData()
            );
            
            BigDecimal totalPoints = gameService.getUserPoints(user);
            
            GameResultDTO result = new GameResultDTO();
            result.setSessionId(session.getId());
            result.setScore(session.getScore());
            result.setPointsEarned(session.getPointsEarned());
            result.setTotalPoints(totalPoints);
            result.setMessage(String.format("Chúc mừng! Bạn đã nhận được %.0f điểm!", session.getPointsEarned().doubleValue()));
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, 
                "Chơi game thành công", 
                result, 
                HttpStatus.OK.value(), 
                java.time.LocalDateTime.now()
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(
                false, 
                e.getMessage(), 
                null, 
                HttpStatus.BAD_REQUEST.value(), 
                java.time.LocalDateTime.now()
            ));
        }
    }
    
    @GetMapping("/quiz/questions")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<List<QuizQuestion>>> getQuizQuestions(Authentication auth) {
        List<QuizQuestion> questions = gameService.generateQuizQuestions();
        return ResponseEntity.ok(new ApiResponse<>(
            true, 
            "Lấy câu hỏi thành công", 
            questions, 
            HttpStatus.OK.value(), 
            java.time.LocalDateTime.now()
        ));
    }
    
    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<List<GameSession>>> getGameHistory(Authentication auth) {
        User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        List<GameSession> history = gameService.getUserGameHistory(user, 10);
        return ResponseEntity.ok(new ApiResponse<>(
            true, 
            "Lấy lịch sử chơi game thành công", 
            history, 
            HttpStatus.OK.value(), 
            java.time.LocalDateTime.now()
        ));
    }
    
    @GetMapping("/points-to-vnd")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<BigDecimal>> convertPointsToVnd(
            Authentication auth,
            java.math.BigDecimal points) {
        BigDecimal vnd = gameService.pointsToVndDiscount(points);
        return ResponseEntity.ok(new ApiResponse<>(
            true, 
            "Chuyển đổi thành công", 
            vnd, 
            HttpStatus.OK.value(), 
            java.time.LocalDateTime.now()
        ));
    }
}

