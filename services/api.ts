
import { AppSettings } from '../types';

interface LoginResponse {
    token: string;
}

/**
 * Sync Operation
 * Represents a single change (upsert or delete) to be sent to the server.
 * 
 * Format:
 * [
 *   {
 *     "op": "upsert",
 *     "data": {
 *       "id": "uuid-v4",
 *       "encrypted_data": "base64_string_given_by_user"
 *     }
 *   },
 *   {
 *     "op": "delete",
 *     "data": { "id": "uuid-v4-to-delete" }
 *   }
 * ]
 */
export type SyncOperation =
    | {
        op: 'upsert';
        data: {
            id: string;
            encrypted_data: string;
        };
    }
    | {
        op: 'delete';
        data: {
            id: string;
        };
    };

/**
 * Sync Response Item
 * Represents a record returned from the server (current state).
 * 
 * Response Format:
 * Array of current records: [{"id": "...", "encrypted_data": "..."}]
 */
export interface SyncResponseItem {
    id: string;
    encrypted_data: string;
}

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export const api = {
    login: async (settings: AppSettings, password: string): Promise<string> => {
        try {
            const response = await fetch(`${settings.syncServerUrl}/api/v1/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: settings.syncUsername,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new ApiError(`Login failed: ${response.statusText}`, response.status);
            }

            const data: LoginResponse = await response.json();
            return data.token;
        } catch (error) {
            console.error("API Login Error:", error);
            throw error;
        }
    },

    sync: async (settings: AppSettings, token: string, operations: SyncOperation[]): Promise<SyncResponseItem[]> => {
        try {
            const response = await fetch(`${settings.syncServerUrl}/api/v1/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(operations),
            });

            if (!response.ok) {
                throw new ApiError(`Sync failed: ${response.statusText}`, response.status);
            }

            const data = await response.json();
            return data || [];
        } catch (error) {
            // Re-throw if it's already an ApiError (from the above check)
            // Otherwise wrap or log
            if (error instanceof ApiError) {
                throw error;
            }
            console.error("API Sync Error:", error);
            throw error;
        }
    }
};
