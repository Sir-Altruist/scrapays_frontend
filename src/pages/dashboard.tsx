import { FETCH_BOOKS } from "@/api/book";
import { useQuery } from "@apollo/client"
import { Box, Button, Spinner, Table, useDialog } from "@chakra-ui/react"
import { useState } from "react"
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
    const { loading, data, error} = useQuery<BooksResponse>(FETCH_BOOKS)
    const navigate = useNavigate()

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


    if(error?.cause?.['code'] === 403){
        localStorage.removeItem('access_token')
        navigate('/login')
    }

    if(loading) return <Spinner />;
  return (
    <Box width={'100%'} height={'100%'} paddingTop={'150px'} display={'flex'} justifyContent={'center'}>
        <Box as={'div'} width={'60%'}>
            <Button backgroundColor={'blue.500'} onClick={() => handleModal("open")}>Upload Book</Button>
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
                        data?.findBooks?.books.map((book, i) => (
                            <Table.Row key={i}>
                            <Table.Cell textAlign={'center'}>{i + 1}</Table.Cell>
                            <Table.Cell textAlign={'center'}>{book.name}</Table.Cell>
                            <Table.Cell textAlign={'center'}>{book.description}</Table.Cell>
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