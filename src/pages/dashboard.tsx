import { FETCH_BOOKS } from "@/api/book";
import { useQuery, useApolloClient } from "@apollo/client"
import { Box, Button, Spinner, Table, useDialog } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router";
import Helpers from '@/helpers';

export interface BooksResponse {
    findBooks: {
        books: {
            id: number
            name: string
            description: string
        }[]
        message: string
        status: string
        code: number
    }
}



const Dashboard = () => {
    const [selectedBook, setSelectedBook] = useState(null)
    // const { loading, data } = useQuery<BooksResponse>(FETCH_BOOKS)
    const navigate = useNavigate()
    const client = useApolloClient()
    const mounted = useRef(false)

    const [loading, setLoading] = useState(false)
    const [books, setBooks] = useState<any>([])

    const { setOpen, open } = useDialog();
    const { setOpen: setOpenUpdate, open: openUpdate } = useDialog();
    const { setOpen: setOpenDelete, open: openDelete } = useDialog();
    const handleModal = (action: string) => {
        action === "open" ? setOpen(true) : setOpen(false)
    }

    const handleUpdateDataModal = (action: string, data?: any) => {
        action === "open" ? setOpenUpdate(true) : setOpenUpdate(false)
        action === "open" && setSelectedBook(data)
    }

    const handleDeleteModal = (action: string, data?: any) => {
        action === "open" ? setOpenDelete(true) : setOpenDelete(false)
        action === "open" && setSelectedBook(data)
    }


    // if(error?.cause?.['code'] === 403){
    //     localStorage.removeItem('access_token')
    //     navigate('/login')
    // }

    useEffect(() => {
        mounted.current = true
        const fetchBooks = async () => {
            setLoading(true)
            const token = localStorage.getItem('access_token')
            if(!token){
                navigate('/login')
                return;
            }

            try {
                const { data, error } = await client.query({
                    query: FETCH_BOOKS,
                    context: {
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    }
                });
                if(error?.cause?.['code'] === 403 || error?.cause?.['code'] === 401){
                    navigate('/login')
                    localStorage.removeItem('access_token')
                }
                setBooks(data?.findBooks?.books || []); 
            } catch (error) {
                localStorage.removeItem('access_token');
                navigate('/login');
                setLoading(false);
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()

        return () => {
            mounted.current = false
        }
    }, [navigate])
    const logout = () => {
        localStorage.removeItem('access_token')
        navigate('/login')
    }

    if(loading) return <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Spinner size={"xl"} marginTop={'300px'} />;
    </Box>
  return (
    <Box width={'100%'} height={'100%'} paddingTop={'150px'} display={'flex'} justifyContent={'center'}>
        <Box as={'div'} width={'60%'}>
            <Box as={'div'} width={'100%'} display={'flex'} justifyContent={'space-between'}>
                <Button backgroundColor={'blue.500'} onClick={() => handleModal("open")}>Upload Book</Button>
                <Button backgroundColor={'red.500'} onClick={() => logout()}>Logout</Button>
            </Box>
            <Table.Root striped width={'100%'} marginTop={'20px'}>
                <Table.Header>
                    <Table.Row fontWeight={'bold'}>
                    <Table.ColumnHeader textAlign={'center'}>S/N</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign={'center'}>Name</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign={'center'}>Description</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign={'center'}>Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        books.map((book, i) => (
                            <Table.Row key={i}>
                            <Table.Cell textAlign={'center'}>{i + 1}</Table.Cell>
                            <Table.Cell textAlign={'center'}>{book?.name}</Table.Cell>
                            <Table.Cell textAlign={'center'}>{book?.description}</Table.Cell>
                            <Table.Cell display={'flex'} gap={'10px'} justifyContent={'center'} alignItems={'center'}>
                                <Button backgroundColor={'green.400'} onClick={() => handleUpdateDataModal("open", book)}>Update</Button>
                                <Button backgroundColor={'red.500'} onClick={() => handleDeleteModal("open", book)}>Delete</Button>
                            </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table.Root>
        </Box>
        <Helpers.UploadModal open={open} handleModal={handleModal} />
       <Helpers.UpdateModal open={openUpdate} handleModal={handleUpdateDataModal} existingData={selectedBook} />
       <Helpers.DeleteModal open={openDelete} handleModal={handleDeleteModal} existingData={selectedBook} />
    </Box>
  )
}

export default Dashboard