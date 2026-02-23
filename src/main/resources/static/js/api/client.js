const GQL_ENDPOINT = 'http://localhost:8080/graphql';

/**
 * Execute a GraphQL query or mutation.
 * @param {string} query - GraphQL query string
 * @param {Object} [variables] - Optional variables (for future use with proper GQL variables)
 * @returns {Promise<Object>} - The `data` field from the response
 */
export async function gql(query, variables = undefined) {
    const res = await fetch(GQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, ...(variables && { variables }) }),
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();

    if (json.errors?.length) {
        const messages = json.errors.map(e => e.message).join(', ');
        throw new Error(`GraphQL error(s): ${messages}`);
    }

    return json.data;
}
