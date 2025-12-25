import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContacts } from '../useContacts';
import { createClient } from '@/lib/supabase/client';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

// Mock error logger
vi.mock('@/lib/utils/errorLogger', () => ({
  logError: vi.fn(),
  getUserFriendlyErrorMessage: vi.fn((err) => err?.message || 'An error occurred'),
  retryWithBackoff: vi.fn((fn) => fn()),
}));

describe('useContacts', () => {
  const mockUser = { id: 'user-123' };
  const mockContacts = [
    {
      id: 'contact-1',
      user_id: 'user-123',
      contact_user_id: 'contact-user-1',
      display_name: 'Alice',
      created_at: '2024-01-01T10:00:00Z',
    },
    {
      id: 'contact-2',
      user_id: 'user-123',
      contact_user_id: 'contact-user-2',
      display_name: 'Bob',
      created_at: '2024-01-02T10:00:00Z',
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
      order: vi.fn(() => ({
        data: mockContacts,
        error: null,
      })),
      insert: vi.fn(() => ({
        error: null,
      })),
    };

    (createClient as any).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch contacts successfully', async () => {
    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.contacts).toHaveLength(2);
    expect(result.current.contacts[0].displayName).toBe('Alice');
    expect(result.current.contacts[1].displayName).toBe('Bob');
    expect(result.current.error).toBeNull();
  });

  it('should add a new contact successfully', async () => {
    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add a new contact
    await result.current.addContact('contact-user-3', 'Charlie');

    expect(mockSupabase.insert).toHaveBeenCalledWith({
      user_id: 'user-123',
      contact_user_id: 'contact-user-3',
      display_name: 'Charlie',
    });
  });

  it('should throw error when adding contact with invalid user ID', async () => {
    mockSupabase.insert.mockReturnValue({
      error: { code: '23503', message: 'Foreign key violation' },
    });

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      result.current.addContact('invalid-user-id', 'Invalid User')
    ).rejects.toThrow('User ID does not exist');
  });

  it('should throw error when adding duplicate contact', async () => {
    mockSupabase.insert.mockReturnValue({
      error: { code: '23505', message: 'Unique constraint violation' },
    });

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      result.current.addContact('contact-user-1', 'Alice')
    ).rejects.toThrow('This contact already exists');
  });

  it('should allow adding self as contact', async () => {
    // Mock successful insert (no error)
    mockSupabase.insert.mockReturnValue({
      error: null,
    });

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should not throw an error when adding self
    await expect(
      result.current.addContact('user-123', 'Myself')
    ).resolves.not.toThrow();

    expect(mockSupabase.insert).toHaveBeenCalledWith({
      user_id: 'user-123',
      contact_user_id: 'user-123',
      display_name: 'Myself',
    });
  });

  it('should refetch contacts after adding a new contact', async () => {
    const selectSpy = vi.spyOn(mockSupabase, 'select');

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCallCount = selectSpy.mock.calls.length;

    // Add a new contact
    await result.current.addContact('contact-user-3', 'Charlie');

    // Should have called select again to refetch
    expect(selectSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
  });

  it('should handle empty contacts list', async () => {
    mockSupabase.order.mockReturnValue({
      data: [],
      error: null,
    });

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.contacts).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error gracefully', async () => {
    mockSupabase.order.mockReturnValue({
      data: null,
      error: { message: 'Database connection failed' },
    });

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.contacts).toHaveLength(0);
    expect(result.current.error).toBeTruthy();
  });

  it('should sort contacts by display name', async () => {
    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockSupabase.order).toHaveBeenCalledWith('display_name', { ascending: true });
  });
});
