import type { Endpoint } from "../types/endpoint";
import { triggerLoading } from "../services/loadingBridge";

const API_URL = `http://${window.location.hostname || "localhost"}:5000/api/`;

const getApiUrl = () => API_URL;

const request = async <T>(
    endpoint: Endpoint,
    options?: RequestInit,
    loadingKey?: string
): Promise<T> => {
    if (loadingKey) triggerLoading(loadingKey, true);
    try {
        const response = await fetch(`${getApiUrl()}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return response.json() as Promise<T>;
    } finally {
        if (loadingKey) triggerLoading(loadingKey, false);
    }
};

export const getData = <T>(
    endpoint: Endpoint,
    loadingKey?: string
): Promise<T> => {
    return request<T>(`${endpoint}/` as Endpoint, undefined, loadingKey);
};

export const postData = <T>(
    endpoint: Endpoint,
    body: unknown,
    loadingKey?: string
): Promise<T> => {
    return request<T>(`${endpoint}/` as Endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }, loadingKey);
};

export const putData = <T>(
    endpoint: Endpoint,
    id: number | string,
    body: unknown,
    loadingKey?: string
): Promise<T> => {
    return request<T>(`${endpoint}/${id}` as Endpoint, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }, loadingKey);
};

export const deleteData = async (
    endpoint: Endpoint,
    id: number,
    loadingKey?: string
): Promise<void> => {
    if (loadingKey) triggerLoading(loadingKey, true);
    try {
        const response = await fetch(`${getApiUrl()}${endpoint}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } finally {
        if (loadingKey) triggerLoading(loadingKey, false);
    }
};