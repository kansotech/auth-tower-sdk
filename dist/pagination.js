"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtils = void 0;
class PaginationUtils {
    static createPagination(limit, offset = 0) {
        return { limit, offset };
    }
    static getNextPage(currentPagination) {
        return {
            limit: currentPagination.limit,
            offset: currentPagination.offset + currentPagination.limit,
        };
    }
    static getPreviousPage(currentPagination) {
        const newOffset = Math.max(0, currentPagination.offset - currentPagination.limit);
        return {
            limit: currentPagination.limit,
            offset: newOffset,
        };
    }
    static hasNextPage(response) {
        return response.offset + response.limit < response.total;
    }
    static hasPreviousPage(response) {
        return response.offset > 0;
    }
    static getTotalPages(response) {
        return Math.ceil(response.total / response.limit);
    }
    static getCurrentPage(response) {
        return Math.floor(response.offset / response.limit) + 1;
    }
}
exports.PaginationUtils = PaginationUtils;
