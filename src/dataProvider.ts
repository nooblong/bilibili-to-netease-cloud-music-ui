import { DataProvider } from "@refinedev/core";

export const dataProvider = (url: string): DataProvider => ({
    getOne: async ({ id, resource }) => {
        const response = await fetch(`${url}/${resource}/${id}`);
        const data = await response.json();

        return {
            data,
        };
    },

    create: async () => {
        throw new Error("Not implemented");
    },
    update: async () => {
        throw new Error("Not implemented");
    },
    deleteOne: async () => {
        throw new Error("Not implemented");
    },
    getList: async ({ resource, pagination }) => {
        const { current = 1, pageSize = 10 } = pagination ?? {};
        const response = await fetch(`${url}/${resource}?page=${current}&size=${pageSize}`);
        const json = await response.json();
        return {
            data: json.data.records,
            total: json.data.total,
        };
    },
    getApiUrl: () => url,
});