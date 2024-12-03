import { gql } from "@apollo/client"


/** Define GraphQL Query */
export const FETCH_BOOKS = gql`
    query FetchBooks {
        findBooks {
            books {
                id
                name
                description
            }
            message
            code
            status

        }
    }
`;

export const UPLOAD_BOOK = gql`
    mutation UploadBook($createInput: CreateInput!) {
        createBook(createInput: $createInput) {
            book {
                id
                name
                description
            }
            message
            status
            code
        }
    }
`;

export const UPDATE_BOOK = gql`
    mutation updateBook($id: Int!, $updateInput: UpdateInput!) {
        updateBook(id: $id, updateInput: $updateInput) {
            message
            status
            code
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation deleteBook($id: Int!) {
        deleteBook(id: $id) {
            message
            status
            code
        }
    }
`;