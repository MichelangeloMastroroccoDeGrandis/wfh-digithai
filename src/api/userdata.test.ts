import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useFetchCalendarData } from './userdata';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('useFetchCalendarData', () => {
  const mockData = [
    {
      name: 'Jon Snow',
      dates: ['2024-12-23', '2024-12-25'],
    },
    {
      name: 'Daenerys Targaryen',
      dates: ['2024-12-24', '2024-12-26'],
    },
    {
      name: 'Tyrion Lannister',
      dates: ['2024-12-23', '2024-12-25', '2024-12-27'],
    },
  ];

  test('should fetch data successfully and set state', async () => {
    mockAxios.get.mockResolvedValue({ data: { data: mockData } });

    const { result } = renderHook(() => useFetchCalendarData('mock-api-url'));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  test('should handle error when data fetching fails', async () => {
    mockAxios.get.mockRejectedValue(new Error('Error fetching data'));

    const { result } = renderHook(() => useFetchCalendarData('mock-api-url'));

    await waitFor(() => {
      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Error fetching data');
    });
  });

  test('should handle no data available', async () => {
    mockAxios.get.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useFetchCalendarData('mock-api-url'));

    await waitFor(() => {
      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('No data available');
    });
  });
});
