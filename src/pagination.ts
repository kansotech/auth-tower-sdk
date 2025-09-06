import { PaginationParams, PaginatedResponse } from './types';

export class PaginationUtils {
  static createPagination(limit: number, offset: number = 0): PaginationParams {
    return { limit, offset };
  }

  static getNextPage(currentPagination: PaginationParams): PaginationParams {
    return {
      limit: currentPagination.limit,
      offset: currentPagination.offset + currentPagination.limit,
    };
  }

  static getPreviousPage(currentPagination: PaginationParams): PaginationParams {
    const newOffset = Math.max(0, currentPagination.offset - currentPagination.limit);
    return {
      limit: currentPagination.limit,
      offset: newOffset,
    };
  }

  static hasNextPage(response: PaginatedResponse): boolean {
    return response.offset + response.limit < response.total;
  }

  static hasPreviousPage(response: PaginatedResponse): boolean {
    return response.offset > 0;
  }

  static getTotalPages(response: PaginatedResponse): number {
    return Math.ceil(response.total / response.limit);
  }

  static getCurrentPage(response: PaginatedResponse): number {
    return Math.floor(response.offset / response.limit) + 1;
  }
}
