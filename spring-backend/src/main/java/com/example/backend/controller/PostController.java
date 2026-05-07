package com.example.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class PostController {

    @GetMapping("/post")
    public Map<String, Object> getPost() {
        return Map.of(
                "id", 1,
                "title", "Spring Boot API 응답",
                "body", "이것은 Spring Boot에서 반환된 예시 데이터입니다."
        );
    }

    @GetMapping("/posts")
    public Map<String, Object> getPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        List<Map<String, Object>> allPosts = IntStream.rangeClosed(1, 20)
                .mapToObj(i -> Map.of(
                        "id", i,
                        "title", "게시물 " + i,
                        "body", "게시물 " + i + " 내용입니다."
                ))
                .collect(Collectors.toList());

        int total = allPosts.size();
        int totalPages = Math.max(1, (int) Math.ceil((double) total / size));
        int normalizedPage = Math.min(Math.max(page, 1), totalPages);
        int fromIndex = (normalizedPage - 1) * size;
        int toIndex = Math.min(fromIndex + size, total);

        List<Map<String, Object>> pageContent = allPosts.subList(fromIndex, toIndex);

        return Map.of(
                "content", pageContent,
                "page", normalizedPage,
                "size", size,
                "total", total,
                "totalPages", totalPages
        );
    }

    @PostMapping("/posts")
    public Map<String, Object> createPost(@RequestBody Map<String, String> postData) {
        String title = postData.get("title");
        String body = postData.get("body");

        // 실제로는 데이터베이스에 저장
        // 여기서는 성공 응답만 반환
        return Map.of(
                "success", true,
                "message", "게시글이 성공적으로 작성되었습니다.",
                "data", Map.of(
                        "id", 21, // 다음 ID
                        "title", title,
                        "body", body
                )
        );
    }
}
