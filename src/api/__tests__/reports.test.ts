import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../utils/supabase';
import { generateWeeklyReport, generateMonthlyReport, generateQuarterlyReport, createReport, getReports } from '../reports';

// Mock Supabase
vi.mock('../../utils/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('Reports API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateWeeklyReport', () => {
    it('should call supabase.rpc with correct parameters', async () => {
      const mockData = {
        students_reached: 100,
        visits_count: 20,
        partnerships: 5,
        active_ambassadors: 15,
        tasks_completed: 50,
      };

      (supabase.rpc as any).mockResolvedValue({ data: mockData, error: null });

      const result = await generateWeeklyReport('2024-01-01', 'ng');

      expect(supabase.rpc).toHaveBeenCalledWith('generate_weekly_report', {
        week_start: '2024-01-01',
        country_code: 'ng',
      });
      expect(result).toEqual(mockData);
    });

    it('should handle errors', async () => {
      (supabase.rpc as any).mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      await expect(generateWeeklyReport('2024-01-01')).rejects.toThrow('Database error');
    });
  });

  describe('generateMonthlyReport', () => {
    it('should call supabase.rpc with correct parameters', async () => {
      const mockData = {
        students_reached: 500,
        visits_count: 100,
        partnerships: 25,
        active_ambassadors: 20,
        tasks_completed: 200,
      };

      (supabase.rpc as any).mockResolvedValue({ data: mockData, error: null });

      const result = await generateMonthlyReport('1', 2024, 'ng');

      expect(supabase.rpc).toHaveBeenCalledWith('generate_monthly_report', {
        month: 1,
        year: 2024,
        country_code: 'ng',
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('generateQuarterlyReport', () => {
    it('should call supabase.rpc with correct parameters', async () => {
      const mockData = {
        students_reached: 1500,
        visits_count: 300,
        partnerships: 75,
        active_ambassadors: 25,
        tasks_completed: 600,
      };

      (supabase.rpc as any).mockResolvedValue({ data: mockData, error: null });

      const result = await generateQuarterlyReport(1, 2024, 'ng');

      expect(supabase.rpc).toHaveBeenCalledWith('generate_quarterly_report', {
        quarter: 1,
        year: 2024,
        country_code: 'ng',
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('createReport', () => {
    it('should insert report data and return created report', async () => {
      const reportData = {
        name: 'Test Report',
        type: 'custom' as const,
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        metrics: ['students_reached', 'visits_count'],
        created_by: 'user-123',
      };

      const mockCreatedReport = { id: 'report-123', ...reportData };

      const mockInsert = vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: mockCreatedReport, error: null })),
        })),
      }));

      (supabase.from as any).mockReturnValue({
        insert: mockInsert,
      });

      const result = await createReport(reportData);

      expect(supabase.from).toHaveBeenCalledWith('reports');
      expect(mockInsert).toHaveBeenCalledWith(reportData);
      expect(result).toEqual(mockCreatedReport);
    });

    it('should handle insert errors', async () => {
      const reportData = {
        name: 'Test Report',
        type: 'custom' as const,
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        metrics: ['students_reached'],
        created_by: 'user-123',
      };

      (supabase.from as any).mockReturnValue({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({ data: null, error: { message: 'Insert failed' } })),
          })),
        })),
      });

      await expect(createReport(reportData)).rejects.toThrow('Insert failed');
    });
  });

  describe('getReports', () => {
    it('should fetch reports for a user', async () => {
      const mockReports = [
        { id: 'report-1', name: 'Report 1', type: 'weekly' },
        { id: 'report-2', name: 'Report 2', type: 'monthly' },
      ];

      const mockSelect = vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({ data: mockReports, error: null })),
        })),
      }));

      (supabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      const result = await getReports('user-123');

      expect(supabase.from).toHaveBeenCalledWith('reports');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockReports);
    });

    it('should handle fetch errors', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({ data: null, error: { message: 'Fetch failed' } })),
          })),
        })),
      });

      await expect(getReports('user-123')).rejects.toThrow('Fetch failed');
    });
  });
});
