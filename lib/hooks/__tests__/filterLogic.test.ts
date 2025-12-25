import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLetters } from "../useLetters";
import { useSentLetters } from "../useSentLetters";
import { createClient } from "@/lib/supabase/client";
import { LetterFilters } from "@/lib/supabase/types";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

// Mock error logger
vi.mock("@/lib/utils/errorLogger", () => ({
  logError: vi.fn(),
  getUserFriendlyErrorMessage: vi.fn(
    (err) => err?.message || "An error occurred"
  ),
  retryWithBackoff: vi.fn((fn) => fn()),
}));

describe("Filter Logic", () => {
  const mockUser = { id: "user-123" };
  const mockLetters = [
    {
      id: "letter-1",
      author_id: "author-1",
      recipient_id: "user-123",
      content: "Letter from author 1",
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
      is_read: false,
      read_at: null,
    },
    {
      id: "letter-2",
      author_id: "author-2",
      recipient_id: "user-123",
      content: "Letter from author 2",
      created_at: "2024-01-05T10:00:00Z",
      updated_at: "2024-01-05T10:00:00Z",
      is_read: false,
      read_at: null,
    },
    {
      id: "letter-3",
      author_id: "author-1",
      recipient_id: "user-123",
      content: "Another letter from author 1",
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-10T10:00:00Z",
      is_read: false,
      read_at: null,
    },
  ];

  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: vi.fn(() => mockSupabase),
      select: vi.fn(() => mockSupabase),
      eq: vi.fn(() => mockSupabase),
      in: vi.fn(() => mockSupabase),
      lt: vi.fn(() => mockSupabase),
      gt: vi.fn(() => mockSupabase),
      order: vi.fn(() => mockSupabase),
    };

    (createClient as any).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Multi-select contact filtering", () => {
    it("should filter by single contact", async () => {
      const filters: LetterFilters = {
        contactIds: ["author-1"],
        beforeDate: null,
        afterDate: null,
      };

      mockSupabase.in.mockImplementation((field: string, values: any[]) => {
        if (field === "author_id") {
          const filtered = mockLetters.filter((l) =>
            values.includes(l.author_id)
          );
          return {
            ...mockSupabase,
            order: vi.fn(() => ({
              data: filtered,
              error: null,
            })),
          };
        }
        return mockSupabase;
      });

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return mockSupabase;
        }
        return mockSupabase;
      });

      const { result } = renderHook(() => useLetters(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSupabase.in).toHaveBeenCalledWith("author_id", ["author-1"]);
    });

    it("should filter by multiple contacts", async () => {
      const filters: LetterFilters = {
        contactIds: ["author-1", "author-2"],
        beforeDate: null,
        afterDate: null,
      };

      mockSupabase.in.mockImplementation((field: string, values: any[]) => {
        if (field === "author_id") {
          const filtered = mockLetters.filter((l) =>
            values.includes(l.author_id)
          );
          return {
            ...mockSupabase,
            order: vi.fn(() => ({
              data: filtered,
              error: null,
            })),
          };
        }
        return mockSupabase;
      });

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return mockSupabase;
        }
        return mockSupabase;
      });

      const { result } = renderHook(() => useLetters(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSupabase.in).toHaveBeenCalledWith("author_id", [
        "author-1",
        "author-2",
      ]);
    });

    it("should not apply contact filter when contactIds is empty", async () => {
      const filters: LetterFilters = {
        contactIds: [],
        beforeDate: null,
        afterDate: null,
      };

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return {
            ...mockSupabase,
            order: vi.fn(() => ({
              data: mockLetters,
              error: null,
            })),
          };
        }
        return mockSupabase;
      });

      const { result } = renderHook(() => useLetters(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSupabase.in).not.toHaveBeenCalled();
    });
  });

  describe("Date range filtering", () => {
    it("should filter letters before a specific date", async () => {
      const beforeDate = new Date("2024-01-06T00:00:00Z");
      const filters: LetterFilters = {
        contactIds: [],
        beforeDate,
        afterDate: null,
      };

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return mockSupabase;
        }
        return mockSupabase;
      });

      mockSupabase.lt.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue({
        data: mockLetters.filter((l) => new Date(l.created_at) < beforeDate),
        error: null,
      });

      const { result } = renderHook(() => useLetters(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSupabase.lt).toHaveBeenCalledWith(
        "created_at",
        beforeDate.toISOString()
      );
    });

    it("should filter letters after a specific date", async () => {
      const afterDate = new Date("2024-01-04T00:00:00Z");
      const filters: LetterFilters = {
        contactIds: [],
        beforeDate: null,
        afterDate,
      };

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return mockSupabase;
        }
        return mockSupabase;
      });

      mockSupabase.gt.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue({
        data: mockLetters.filter((l) => new Date(l.created_at) > afterDate),
        error: null,
      });

      const { result } = renderHook(() => useLetters(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSupabase.gt).toHaveBeenCalledWith(
        "created_at",
        afterDate.toISOString()
      );
    });

    it("should filter letters within a date range", async () => {
      const beforeDate = new Date("2024-01-08T00:00:00Z");
      const afterDate = new Date("2024-01-02T00:00:00Z");
      const filters: LetterFilters = {
        contactIds: [],
        beforeDate,
        afterDate,
      };

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return mockSupabase;
        }
        return mockSupabase;
      });

      mockSupabase.lt.mockReturnValue(mockSupabase);
      mockSupabase.gt.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue({
        data: mockLetters.filter(
          (l) =>
            new Date(l.created_at) > afterDate &&
            new Date(l.created_at) < beforeDate
        ),
        error: null,
      });

      const { result } = renderHook(() => useLetters(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSupabase.lt).toHaveBeenCalledWith(
        "created_at",
        beforeDate.toISOString()
      );
      expect(mockSupabase.gt).toHaveBeenCalledWith(
        "created_at",
        afterDate.toISOString()
      );
    });
  });

  describe("Combined filters", () => {
    it("should apply contact and date filters together", async () => {
      const beforeDate = new Date("2024-01-08T00:00:00Z");
      const afterDate = new Date("2024-01-02T00:00:00Z");
      const filters: LetterFilters = {
        contactIds: ["author-1"],
        beforeDate,
        afterDate,
      };

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return mockSupabase;
        }
        return mockSupabase;
      });

      mockSupabase.in.mockReturnValue(mockSupabase);
      mockSupabase.lt.mockReturnValue(mockSupabase);
      mockSupabase.gt.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue({
        data: mockLetters.filter(
          (l) =>
            l.author_id === "author-1" &&
            new Date(l.created_at) > afterDate &&
            new Date(l.created_at) < beforeDate
        ),
        error: null,
      });

      const { result } = renderHook(() => useLetters(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSupabase.in).toHaveBeenCalledWith("author_id", ["author-1"]);
      expect(mockSupabase.lt).toHaveBeenCalledWith(
        "created_at",
        beforeDate.toISOString()
      );
      expect(mockSupabase.gt).toHaveBeenCalledWith(
        "created_at",
        afterDate.toISOString()
      );
    });

    it("should apply multiple contacts with date range", async () => {
      const beforeDate = new Date("2024-01-12T00:00:00Z");
      const filters: LetterFilters = {
        contactIds: ["author-1", "author-2"],
        beforeDate,
        afterDate: null,
      };

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return mockSupabase;
        }
        return mockSupabase;
      });

      mockSupabase.in.mockReturnValue(mockSupabase);
      mockSupabase.lt.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue({
        data: mockLetters.filter(
          (l) =>
            ["author-1", "author-2"].includes(l.author_id) &&
            new Date(l.created_at) < beforeDate
        ),
        error: null,
      });

      const { result } = renderHook(() => useLetters(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSupabase.in).toHaveBeenCalledWith("author_id", [
        "author-1",
        "author-2",
      ]);
      expect(mockSupabase.lt).toHaveBeenCalledWith(
        "created_at",
        beforeDate.toISOString()
      );
    });

    it("should maintain sort order with filters applied", async () => {
      const filters: LetterFilters = {
        contactIds: ["author-1"],
        beforeDate: null,
        afterDate: null,
      };

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return mockSupabase;
        }
        return mockSupabase;
      });

      mockSupabase.in.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue({
        data: mockLetters.filter((l) => l.author_id === "author-1"),
        error: null,
      });

      const { result } = renderHook(() => useLetters(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify that order is called with correct parameters for unread letters (oldest first)
      expect(mockSupabase.order).toHaveBeenCalledWith("created_at", {
        ascending: true,
      });
    });
  });

  describe("Filter clearing", () => {
    it("should return all letters when filters are cleared", async () => {
      const emptyFilters: LetterFilters = {
        contactIds: [],
        beforeDate: null,
        afterDate: null,
      };

      mockSupabase.eq.mockImplementation((field: string, value: any) => {
        if (field === "is_read" && value === false) {
          return {
            ...mockSupabase,
            order: vi.fn(() => ({
              data: mockLetters,
              error: null,
            })),
          };
        }
        return mockSupabase;
      });

      const { result } = renderHook(() => useLetters(emptyFilters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should not call filter methods
      expect(mockSupabase.in).not.toHaveBeenCalled();
      expect(mockSupabase.lt).not.toHaveBeenCalled();
      expect(mockSupabase.gt).not.toHaveBeenCalled();
    });
  });
});
