import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLetters } from "../useLetters";
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

describe("useLetters", () => {
  const mockUser = { id: "user-123" };
  const mockUnreadLetters = [
    {
      id: "letter-1",
      author_id: "author-1",
      recipient_id: "user-123",
      content: "First unread letter",
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
      is_read: false,
      read_at: null,
    },
    {
      id: "letter-2",
      author_id: "author-2",
      recipient_id: "user-123",
      content: "Second unread letter",
      created_at: "2024-01-02T10:00:00Z",
      updated_at: "2024-01-02T10:00:00Z",
      is_read: false,
      read_at: null,
    },
  ];

  const mockReadLetters = [
    {
      id: "letter-3",
      author_id: "author-1",
      recipient_id: "user-123",
      content: "First read letter",
      created_at: "2024-01-03T10:00:00Z",
      updated_at: "2024-01-03T10:00:00Z",
      is_read: true,
      read_at: "2024-01-03T11:00:00Z",
    },
    {
      id: "letter-4",
      author_id: "author-2",
      recipient_id: "user-123",
      content: "Second read letter",
      created_at: "2024-01-04T10:00:00Z",
      updated_at: "2024-01-04T10:00:00Z",
      is_read: true,
      read_at: "2024-01-04T11:00:00Z",
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
      update: vi.fn(() => mockSupabase),
    };

    (createClient as any).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch unread letters sorted by oldest first", async () => {
    mockSupabase.eq.mockImplementation((field: string, value: any) => {
      if (field === "is_read" && value === false) {
        return {
          ...mockSupabase,
          order: vi.fn(() => ({
            ...mockSupabase,
            data: mockUnreadLetters,
            error: null,
          })),
        };
      }
      return mockSupabase;
    });

    const { result } = renderHook(() => useLetters());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.letters).toHaveLength(2);
    expect(result.current.letters[0].id).toBe("letter-1");
    expect(result.current.letters[1].id).toBe("letter-2");
    expect(result.current.letters[0].isRead).toBe(false);
  });

  it("should fetch read letters sorted by newest first when no unread letters exist", async () => {
    let callCount = 0;
    mockSupabase.eq.mockImplementation((field: string, value: any) => {
      if (field === "is_read") {
        callCount++;
        if (value === false) {
          // First call for unread letters - return empty
          return {
            ...mockSupabase,
            order: vi.fn(() => ({
              ...mockSupabase,
              data: [],
              error: null,
            })),
          };
        } else if (value === true) {
          // Second call for read letters
          return {
            ...mockSupabase,
            order: vi.fn(() => ({
              ...mockSupabase,
              data: mockReadLetters.reverse(), // Newest first
              error: null,
            })),
          };
        }
      }
      return mockSupabase;
    });

    const { result } = renderHook(() => useLetters());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.letters).toHaveLength(2);
    expect(result.current.letters[0].id).toBe("letter-4"); // Newest first
    expect(result.current.letters[1].id).toBe("letter-3");
    expect(result.current.letters[0].isRead).toBe(true);
  });

  it("should apply contact filter correctly", async () => {
    const filters: LetterFilters = {
      contactIds: ["author-1"],
      beforeDate: null,
      afterDate: null,
    };

    mockSupabase.in.mockImplementation((field: string, values: any[]) => {
      if (field === "author_id") {
        const filtered = mockUnreadLetters.filter((l) =>
          values.includes(l.author_id)
        );
        return {
          ...mockSupabase,
          order: vi.fn(() => ({
            ...mockSupabase,
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

  it("should apply date range filters correctly", async () => {
    const beforeDate = new Date("2024-01-02T00:00:00Z");
    const afterDate = new Date("2024-01-01T00:00:00Z");

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
      ...mockSupabase,
      data: [mockUnreadLetters[0]],
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

  it("should apply combined filters correctly", async () => {
    const filters: LetterFilters = {
      contactIds: ["author-1", "author-2"],
      beforeDate: new Date("2024-01-03T00:00:00Z"),
      afterDate: new Date("2024-01-01T00:00:00Z"),
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
      ...mockSupabase,
      data: mockUnreadLetters,
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
      filters.beforeDate!.toISOString()
    );
    expect(mockSupabase.gt).toHaveBeenCalledWith(
      "created_at",
      filters.afterDate!.toISOString()
    );
  });
});
