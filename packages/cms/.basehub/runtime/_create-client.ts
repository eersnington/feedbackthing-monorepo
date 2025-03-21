// This file was generated by basehub. Do not edit directly. Read more: https://basehub.com/docs/api-reference/basehub-sdk

/* eslint-disable */
/* eslint-disable eslint-comments/no-restricted-disable */
/* tslint:disable */

// @ts-nocheck
import { type BatchOptions, createFetcher } from './_fetcher'
import type { ExecutionResult, LinkedType } from './_types'
import {
    generateGraphqlOperation,
    type GraphqlOperation,
} from './_generate-graphql-operation'
import { replaceSystemAliases } from './_aliasing'

export type Headers =
    | HeadersInit
    | (() => HeadersInit)
    | (() => Promise<HeadersInit>)

export type BaseFetcher = (
    operation: GraphqlOperation | GraphqlOperation[],
    extraFetchOptions?: Partial<RequestInit>,
) => Promise<ExecutionResult | ExecutionResult[]>

export type ClientOptions = Omit<RequestInit, 'body' | 'headers'> & {
    url?: string
    batch?: BatchOptions | boolean
    fetcher?: BaseFetcher
    fetch?: Function
    headers?: Headers
}

export const createClient = ({
    queryRoot,
    mutationRoot,
    subscriptionRoot,
    getExtraFetchOptions,
    ...options
}: ClientOptions & {
    queryRoot?: LinkedType
    mutationRoot?: LinkedType
    subscriptionRoot?: LinkedType
    getExtraFetchOptions?: (
        op: 'query' | 'mutation',
        body: GraphqlOperation,
        originalRequest: any,
    ) => Partial<RequestInit> | Promise<Partial<RequestInit>>
}) => {
    const fetcher = createFetcher(options)
    const client: {
        query?: Function
        mutation?: Function
    } = {}

    if (queryRoot) {
        client.query = async (request: any) => {
            if (!queryRoot) throw new Error('queryRoot argument is missing')

            const body = generateGraphqlOperation('query', queryRoot, request)
            const extraFetchOptions = await getExtraFetchOptions?.(
                'query',
                body,
                request,
            )

            return await fetcher(body, extraFetchOptions).then((result) =>
                replaceSystemAliases(result),
            )
        }
    }
    if (mutationRoot) {
        client.mutation = async (request: any) => {
            if (!mutationRoot)
                throw new Error('mutationRoot argument is missing')

            const body = generateGraphqlOperation(
                'mutation',
                mutationRoot,
                request,
            )
            const extraFetchOptions = await getExtraFetchOptions?.(
                'mutation',
                body,
                request,
            )
            return await fetcher(
                generateGraphqlOperation('mutation', mutationRoot, request),
                extraFetchOptions,
            )
        }
    }

    return client as any
}

createClient.replaceSystemAliases = replaceSystemAliases
