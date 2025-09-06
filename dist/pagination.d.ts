import { PaginationParams, PaginatedResponse } from './types';
export declare class PaginationUtils {
    static createPagination(limit: number, offset?: number): PaginationParams;
    static getNextPage(currentPagination: PaginationParams): PaginationParams;
    static getPreviousPage(currentPagination: PaginationParams): PaginationParams;
    static hasNextPage(response: PaginatedResponse): boolean;
    static hasPreviousPage(response: PaginatedResponse): boolean;
    static getTotalPages(response: PaginatedResponse): number;
    static getCurrentPage(response: PaginatedResponse): number;
}
